import type { SankeyKey, SankeyColumn, SankeyItem } from "../types/index.ts";
import { dataStore } from "./data.svelte.ts";

export type Navigation = {
	focusedItemId: SankeyKey | null;
	currentColumnIndex: number;
	currentItemIndex: number;
};

export type NavigationItem = {
	id: SankeyKey;
	type: "anchor" | "path";
	rowIndex: number;
	itemIndex: number;
	sourceId?: SankeyKey; // For paths: source anchor
	targetId?: SankeyKey; // For paths: target anchor
};

export type NavigationColumn = {
	columnKey: SankeyKey;
	items: Array<NavigationItem>;
};

export type NavigationGrid = {
	columns: Array<NavigationColumn>;
};

class KeyboardNavigationStore {
	focusedItemId = $state<SankeyKey | null>(null);
	currentColumnIndex = $state<number>(0);
	currentItemIndex = $state<number>(0);

	navGrid = $derived.by(() => {
		// Check if data store has any data
		const dataValue = dataStore.data;
		if (!dataValue || Object.keys(dataValue).length === 0) {
			return { columns: [] };
		}

		const columns = Object.entries(dataValue).map(([columnKey, column]) => ({
			columnKey: columnKey as SankeyKey,
			items: this.buildColumnItems(column)
		}));

		return { columns };
	});

	// Helper to add items for a single item
	addItemAndPaths(item: SankeyItem, rowIndex: number, itemIndex: number, items: Array<NavigationItem>) {
		// Add anchor item
		items.push({
			id: item.id,
			type: "anchor",
			rowIndex,
			itemIndex
		});

		// Add paths from this item (if any)
		if (item.links) {
			item.links.forEach((link) => {
				items.push({
					id: `${item.id}/${link.target}`,
					type: "path",
					rowIndex,
					itemIndex,
					sourceId: item.id,
					targetId: link.target
				});
			});
		}
	}

	// Build navigation grid from data store
	buildColumnItems(column: SankeyColumn): Array<NavigationItem> {
		const items: Array<NavigationItem> = [];

		column.rows.forEach((row, rowIndex) => {
			row.items.forEach((item, itemIndex) => {
				this.addItemAndPaths(item, rowIndex, itemIndex, items);
			});
		});

		return items;
	}

	// Find item position in navigation grid
	findItemPosition(itemId: SankeyKey): { columnIndex: number; itemIndex: number } | null {
		for (let columnIndex = 0; columnIndex < this.navGrid.columns.length; columnIndex++) {
			const column = this.navGrid.columns[columnIndex];
			for (let itemIndex = 0; itemIndex < column.items.length; itemIndex++) {
				if (column.items[itemIndex].id === itemId) {
					return { columnIndex, itemIndex };
				}
			}
		}

		return null;
	}

	getCurrentFocusedItem(): NavigationItem | null {
		if (this.currentColumnIndex < 0 || this.currentItemIndex < 0) {
			return null;
		}

		const column = this.navGrid.columns[this.currentColumnIndex];
		if (!column || !column.items[this.currentItemIndex]) {
			return null;
		}

		return column.items[this.currentItemIndex];
	}

	findPathFromAnchor(anchorId: SankeyKey): NavigationItem | null {
		for (const column of this.navGrid.columns) {
			for (const item of column.items) {
				if (item.type === "path" && item.sourceId === anchorId && this.isItemInteractive(item.id)) {
					return item;
				}
			}
		}
		return null;
	}

	findAnchorById(anchorId: SankeyKey): NavigationItem | null {
		for (const column of this.navGrid.columns) {
			for (const item of column.items) {
				if (item.type === "anchor" && item.id === anchorId) {
					return item;
				}
			}
		}
		return null;
	}

	findPathToAnchor(anchorId: SankeyKey): NavigationItem | null {
		for (const column of this.navGrid.columns) {
			for (const item of column.items) {
				if (item.type === "path" && item.targetId === anchorId && this.isItemInteractive(item.id)) {
					return item;
				}
			}
		}
		return null;
	}

	isItemInteractive(itemId: SankeyKey): boolean {
		// Check if the element exists in the DOM and is focusable
		const element = document.querySelector(`[data-item-id="${itemId}"]`);
		if (element) {
			// Check if element has role="button" (interactive paths)
			const role = element.getAttribute("role");
			return role === "button";
		}

		// If element doesn't exist in DOM, it's not interactive
		return false;
	}

	setFocusedItem(itemId: SankeyKey) {
		const position = this.findItemPosition(itemId);
		if (position) {
			this.focusedItemId = itemId;
			this.currentColumnIndex = position.columnIndex;
			this.currentItemIndex = position.itemIndex;
		}
	}

	navigateVertical(direction: "up" | "down"): SankeyKey | null {
		// If no columns, return null
		if (this.navGrid.columns.length === 0) return null;

		// Ensure we have a valid current position
		if (!this.focusedItemId) {
			return this.initializeFocus();
		}

		const currentItem = this.getCurrentFocusedItem();
		if (!currentItem) return null;

		// Navigate within the same type: anchors to anchors, paths to paths
		if (currentItem.type === "anchor") {
			return this.navigateVerticallyBetweenAnchors(direction);
		} else if (currentItem.type === "path") {
			return this.navigateVerticallyBetweenPaths(direction);
		}

		return null;
	}

	navigateVerticallyBetweenAnchors = (direction: "up" | "down"): SankeyKey | null => {
		const currentColumn = this.navGrid.columns[this.currentColumnIndex];
		if (!currentColumn) return null;

		// Get only anchor items from the current column
		const anchorItems = currentColumn.items.filter((item) => item.type === "anchor");

		// Find current anchor's position in the anchor-only list
		const currentAnchorIndex = anchorItems.findIndex((item) => item.id === this.focusedItemId);
		if (currentAnchorIndex === -1) return null;

		const delta = direction === "up" ? -1 : 1;
		const newAnchorIndex = currentAnchorIndex + delta;

		if (newAnchorIndex >= 0 && newAnchorIndex < anchorItems.length) {
			const targetAnchor = anchorItems[newAnchorIndex];

			// Update navigation store with the actual position of this anchor in the full items list
			const actualPosition = this.findItemPosition(targetAnchor.id);
			if (actualPosition) {
				this.focusedItemId = targetAnchor.id;
				this.currentColumnIndex = actualPosition.columnIndex;
				this.currentItemIndex = actualPosition.itemIndex;
				return targetAnchor.id;
			}
		}

		return null;
	};

	navigateVerticallyBetweenPaths = (direction: "up" | "down"): SankeyKey | null => {
		const currentItem = this.getCurrentFocusedItem();
		if (!currentItem || currentItem.type !== "path") return null;

		// Find the target column index (where this path leads to)
		const targetAnchor = this.findAnchorById(currentItem.targetId!);
		if (!targetAnchor) return null;

		const targetColumnPosition = this.findItemPosition(targetAnchor.id);
		if (!targetColumnPosition) return null;

		// Get all interactive paths that target the same column (same "flow level")
		const pathsInSameFlowLevel: NavigationItem[] = [];

		this.navGrid.columns.forEach((column) => {
			column.items.forEach((item) => {
				if (item.type === "path" && item.targetId && this.isItemInteractive(item.id)) {
					const pathTargetAnchor = this.findAnchorById(item.targetId);
					if (pathTargetAnchor) {
						const pathTargetPosition = this.findItemPosition(pathTargetAnchor.id);
						if (pathTargetPosition && pathTargetPosition.columnIndex === targetColumnPosition.columnIndex) {
							pathsInSameFlowLevel.push(item);
						}
					}
				}
			});
		});

		// Sort paths by their source row position (the row of their source anchor)
		pathsInSameFlowLevel.sort((a, b) => {
			return a.rowIndex - b.rowIndex;
		});

		// Find current path's position in the same-flow-level paths list
		const currentPathIndex = pathsInSameFlowLevel.findIndex((item) => item.id === this.focusedItemId);
		if (currentPathIndex === -1) return null;

		const delta = direction === "up" ? -1 : 1;
		const newPathIndex = currentPathIndex + delta;

		if (newPathIndex >= 0 && newPathIndex < pathsInSameFlowLevel.length) {
			const targetPath = pathsInSameFlowLevel[newPathIndex];

			// Update navigation store (paths don't have a fixed column, so we keep the current position context)
			this.focusedItemId = targetPath.id;
			return targetPath.id;
		}

		return null;
	};

	// Navigate from anchor to path
	navigateAnchorToPath = (currentItem: NavigationItem): SankeyKey | null => {
		const pathFromCurrentAnchor = this.findPathFromAnchor(currentItem.id);
		if (pathFromCurrentAnchor) {
			this.focusedItemId = pathFromCurrentAnchor.id;
			return pathFromCurrentAnchor.id;
		}
		return null;
	};

	// Navigate from path to target anchor
	navigatePathToAnchor = (currentItem: NavigationItem): SankeyKey | null => {
		if (!currentItem.targetId) return null;

		const targetAnchor = this.findAnchorById(currentItem.targetId);
		if (targetAnchor) {
			const position = this.findItemPosition(targetAnchor.id);
			if (position) {
				this.focusedItemId = targetAnchor.id;
				this.currentColumnIndex = position.columnIndex;
				this.currentItemIndex = position.itemIndex;
				return targetAnchor.id;
			}
		}
		return null;
	};

	// Navigate from anchor to incoming path (left navigation)
	navigateAnchorToIncomingPath = (currentItem: NavigationItem): SankeyKey | null => {
		const pathToCurrentAnchor = this.findPathToAnchor(currentItem.id);
		if (pathToCurrentAnchor) {
			this.focusedItemId = pathToCurrentAnchor.id;
			return pathToCurrentAnchor.id;
		}
		return null;
	};

	// Navigate from path to source anchor (left navigation)
	navigatePathToSourceAnchor = (currentItem: NavigationItem): SankeyKey | null => {
		if (!currentItem.sourceId) return null;

		const sourceAnchor = this.findAnchorById(currentItem.sourceId);
		if (sourceAnchor) {
			const position = this.findItemPosition(sourceAnchor.id);
			if (position) {
				this.focusedItemId = sourceAnchor.id;
				this.currentColumnIndex = position.columnIndex;
				this.currentItemIndex = position.itemIndex;
				return sourceAnchor.id;
			}
		}
		return null;
	};

	// Navigate to first anchor in target column
	navigateToColumnAnchor = (newColumnIndex: number): SankeyKey | null => {
		const targetColumn = this.navGrid.columns[newColumnIndex];
		if (targetColumn.items.length === 0) return null;

		const firstAnchor = targetColumn.items.find((item) => item.type === "anchor");
		if (firstAnchor) {
			const position = this.findItemPosition(firstAnchor.id);
			if (position) {
				this.focusedItemId = firstAnchor.id;
				this.currentColumnIndex = position.columnIndex;
				this.currentItemIndex = position.itemIndex;
				return firstAnchor.id;
			}
		}
		return null;
	};

	getDocumentDirection = () => {
		return document.documentElement.dir;
	};

	isRTLDirection = () => this.getDocumentDirection() === "rtl";

	// Handle directional navigation logic
	handleDirectionalNavigation = (direction: "left" | "right", currentItem: NavigationItem): SankeyKey | null => {
		// In RTL, reverse the logical meaning of left/right
		const forwardDirection = this.isRTLDirection() ? "left" : "right";
		const backwardDirection = this.isRTLDirection() ? "right" : "left";

		if (direction === forwardDirection) {
			// Forward flow: anchor → path → target anchor
			if (currentItem.type === "anchor" && !currentItem.sourceId) {
				return this.navigateAnchorToPath(currentItem);
			} else if (currentItem.type === "path") {
				return this.navigatePathToAnchor(currentItem);
			}
		} else if (direction === backwardDirection) {
			// Backward flow: anchor ← path ← source anchor
			if (currentItem.type === "anchor" && !currentItem.sourceId) {
				return this.navigateAnchorToIncomingPath(currentItem);
			} else if (currentItem.type === "path") {
				return this.navigatePathToSourceAnchor(currentItem);
			}
		}
		return null;
	};

	// Navigate horizontally between columns
	navigateHorizontal = (direction: "left" | "right"): SankeyKey | null => {
		if (this.navGrid.columns.length === 0) return null;

		if (!this.focusedItemId) {
			return this.initializeFocus();
		}

		const currentItem = this.getCurrentFocusedItem();
		if (!currentItem) return null;

		// Try directional flow navigation first
		const flowResult = this.handleDirectionalNavigation(direction, currentItem);
		if (flowResult) return flowResult;

		// Default column-based navigation (respecting RTL)

		let delta: number;

		if (this.isRTLDirection()) {
			// In RTL: left moves forward (+1), right moves backward (-1)
			delta = direction === "left" ? 1 : -1;
		} else {
			// In LTR: right moves forward (+1), left moves backward (-1)
			delta = direction === "left" ? -1 : 1;
		}

		const newColumnIndex = this.currentColumnIndex + delta;

		if (newColumnIndex >= 0 && newColumnIndex < this.navGrid.columns.length) {
			return this.navigateToColumnAnchor(newColumnIndex);
		}

		return null;
	};

	getFirstFocusableItemId = (): SankeyKey | null => {
		if (this.navGrid.columns.length > 0) {
			// Find the first anchor (not path) in the first column
			const firstAnchor = this.navGrid.columns[0].items.find((item) => item.type === "anchor");
			if (firstAnchor) {
				return firstAnchor.id;
			}
		}
		return null;
	};

	initializeFocus = (): SankeyKey | null => {
		const firstItemId = this.getFirstFocusableItemId();
		if (firstItemId) {
			this.focusedItemId = firstItemId;
			this.currentColumnIndex = 0;
			this.currentItemIndex = 0;
		}
		return firstItemId;
	};

	clearFocus = () => {
		this.focusedItemId = null;
	};
}

export const keyboardNavStore = new KeyboardNavigationStore();
