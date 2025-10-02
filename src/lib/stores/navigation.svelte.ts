import type { SankeyKey, SankeyColumn, SankeyItem } from "../types";
import { dataStore } from "./data.svelte.ts";

export type NavigationStore = {
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

const createNavigationStore = () => {
	const navigationStore = $state<NavigationStore>({
		focusedItemId: null,
		currentColumnIndex: 0,
		currentItemIndex: 0
	});

	// Helper to add items for a single item
	const addItemAndPaths = (item: SankeyItem, rowIndex: number, itemIndex: number, items: Array<NavigationItem>) => {
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
	};

	// Build navigation grid from data store
	const buildColumnItems = (column: SankeyColumn): Array<NavigationItem> => {
		const items: Array<NavigationItem> = [];

		column.rows.forEach((row, rowIndex) => {
			row.items.forEach((item, itemIndex) => {
				addItemAndPaths(item, rowIndex, itemIndex, items);
			});
		});

		return items;
	};

	const getNavigationGrid = (): NavigationGrid => {
		// Check if data store has any data
		const dataValue = dataStore.data;
		if (!dataValue || Object.keys(dataValue).length === 0) {
			return { columns: [] };
		}

		const columns = Object.entries(dataValue).map(([columnKey, column]) => ({
			columnKey: columnKey as SankeyKey,
			items: buildColumnItems(column)
		}));

		return { columns };
	};

	// Find item position in navigation grid
	const findItemPosition = (itemId: SankeyKey): { columnIndex: number; itemIndex: number } | null => {
		const grid = getNavigationGrid();

		for (let columnIndex = 0; columnIndex < grid.columns.length; columnIndex++) {
			const column = grid.columns[columnIndex];
			for (let itemIndex = 0; itemIndex < column.items.length; itemIndex++) {
				if (column.items[itemIndex].id === itemId) {
					return { columnIndex, itemIndex };
				}
			}
		}

		return null;
	};

	// Helper functions for navigation
	const getCurrentFocusedItem = (): NavigationItem | null => {
		if (!navigationStore.focusedItemId) return null;

		const grid = getNavigationGrid();
		for (const column of grid.columns) {
			for (const item of column.items) {
				if (item.id === navigationStore.focusedItemId) {
					return item;
				}
			}
		}
		return null;
	};

	const findPathFromAnchor = (anchorId: SankeyKey): NavigationItem | null => {
		const grid = getNavigationGrid();
		for (const column of grid.columns) {
			for (const item of column.items) {
				if (item.type === "path" && item.sourceId === anchorId && isItemInteractive(item.id)) {
					return item;
				}
			}
		}
		return null;
	};

	const findAnchorById = (anchorId: SankeyKey): NavigationItem | null => {
		const grid = getNavigationGrid();
		for (const column of grid.columns) {
			for (const item of column.items) {
				if (item.type === "anchor" && item.id === anchorId) {
					return item;
				}
			}
		}
		return null;
	};

	const findPathToAnchor = (anchorId: SankeyKey): NavigationItem | null => {
		const grid = getNavigationGrid();
		for (const column of grid.columns) {
			for (const item of column.items) {
				if (item.type === "path" && item.targetId === anchorId && isItemInteractive(item.id)) {
					return item;
				}
			}
		}
		return null;
	};

	const isItemInteractive = (itemId: SankeyKey): boolean => {
		// Check if the element exists in the DOM and is focusable
		const element = document.querySelector(`[data-item-id="${itemId}"]`);
		if (element) {
			// Check if element has role="button" (interactive paths)
			const role = element.getAttribute("role");
			return role === "button";
		}

		// If element doesn't exist in DOM, it's not interactive
		return false;
	};

	// Set focus to a specific item
	const setFocusedItem = (itemId: SankeyKey) => {
		const position = findItemPosition(itemId);
		if (position) {
			navigationStore.focusedItemId = itemId;
			navigationStore.currentColumnIndex = position.columnIndex;
			navigationStore.currentItemIndex = position.itemIndex;
		}
	};

	// Navigate vertically within the same type (anchors to anchors, paths to paths)
	const navigateVertical = (direction: "up" | "down"): SankeyKey | null => {
		const grid = getNavigationGrid();

		// If no columns, return null
		if (grid.columns.length === 0) return null;

		// Ensure we have a valid current position
		if (!navigationStore.focusedItemId) {
			return initializeFocus();
		}

		const currentItem = getCurrentFocusedItem();
		if (!currentItem) return null;

		// Navigate within the same type: anchors to anchors, paths to paths
		if (currentItem.type === "anchor") {
			return navigateVerticallyBetweenAnchors(direction, grid);
		} else if (currentItem.type === "path") {
			return navigateVerticallyBetweenPaths(direction, grid);
		}

		return null;
	};

	// Navigate vertically between anchors only
	const navigateVerticallyBetweenAnchors = (direction: "up" | "down", grid: NavigationGrid): SankeyKey | null => {
		const currentColumn = grid.columns[navigationStore.currentColumnIndex];
		if (!currentColumn) return null;

		// Get only anchor items from the current column
		const anchorItems = currentColumn.items.filter((item) => item.type === "anchor");

		// Find current anchor's position in the anchor-only list
		const currentAnchorIndex = anchorItems.findIndex((item) => item.id === navigationStore.focusedItemId);
		if (currentAnchorIndex === -1) return null;

		const delta = direction === "up" ? -1 : 1;
		const newAnchorIndex = currentAnchorIndex + delta;

		if (newAnchorIndex >= 0 && newAnchorIndex < anchorItems.length) {
			const targetAnchor = anchorItems[newAnchorIndex];

			// Update navigation store with the actual position of this anchor in the full items list
			const actualPosition = findItemPosition(targetAnchor.id);
			if (actualPosition) {
				navigationStore.focusedItemId = targetAnchor.id;
				navigationStore.currentColumnIndex = actualPosition.columnIndex;
				navigationStore.currentItemIndex = actualPosition.itemIndex;
				return targetAnchor.id;
			}
		}

		return null;
	};

	// Navigate vertically between paths only
	const navigateVerticallyBetweenPaths = (direction: "up" | "down", grid: NavigationGrid): SankeyKey | null => {
		const currentItem = getCurrentFocusedItem();
		if (!currentItem || currentItem.type !== "path") return null;

		// Find the target column index (where this path leads to)
		const targetAnchor = findAnchorById(currentItem.targetId!);
		if (!targetAnchor) return null;

		const targetColumnPosition = findItemPosition(targetAnchor.id);
		if (!targetColumnPosition) return null;

		// Get all interactive paths that target the same column (same "flow level")
		const pathsInSameFlowLevel: NavigationItem[] = [];

		grid.columns.forEach((column) => {
			column.items.forEach((item) => {
				if (item.type === "path" && item.targetId && isItemInteractive(item.id)) {
					const pathTargetAnchor = findAnchorById(item.targetId);
					if (pathTargetAnchor) {
						const pathTargetPosition = findItemPosition(pathTargetAnchor.id);
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
		const currentPathIndex = pathsInSameFlowLevel.findIndex((item) => item.id === navigationStore.focusedItemId);
		if (currentPathIndex === -1) return null;

		const delta = direction === "up" ? -1 : 1;
		const newPathIndex = currentPathIndex + delta;

		if (newPathIndex >= 0 && newPathIndex < pathsInSameFlowLevel.length) {
			const targetPath = pathsInSameFlowLevel[newPathIndex];

			// Update navigation store (paths don't have a fixed column, so we keep the current position context)
			navigationStore.focusedItemId = targetPath.id;
			return targetPath.id;
		}

		return null;
	};

	// Navigate from anchor to path
	const navigateAnchorToPath = (currentItem: NavigationItem): SankeyKey | null => {
		const pathFromCurrentAnchor = findPathFromAnchor(currentItem.id);
		if (pathFromCurrentAnchor) {
			navigationStore.focusedItemId = pathFromCurrentAnchor.id;
			return pathFromCurrentAnchor.id;
		}
		return null;
	};

	// Navigate from path to target anchor
	const navigatePathToAnchor = (currentItem: NavigationItem): SankeyKey | null => {
		if (!currentItem.targetId) return null;

		const targetAnchor = findAnchorById(currentItem.targetId);
		if (targetAnchor) {
			const position = findItemPosition(targetAnchor.id);
			if (position) {
				navigationStore.focusedItemId = targetAnchor.id;
				navigationStore.currentColumnIndex = position.columnIndex;
				navigationStore.currentItemIndex = position.itemIndex;
				return targetAnchor.id;
			}
		}
		return null;
	};

	// Navigate from anchor to incoming path (left navigation)
	const navigateAnchorToIncomingPath = (currentItem: NavigationItem): SankeyKey | null => {
		const pathToCurrentAnchor = findPathToAnchor(currentItem.id);
		if (pathToCurrentAnchor) {
			navigationStore.focusedItemId = pathToCurrentAnchor.id;
			return pathToCurrentAnchor.id;
		}
		return null;
	};

	// Navigate from path to source anchor (left navigation)
	const navigatePathToSourceAnchor = (currentItem: NavigationItem): SankeyKey | null => {
		if (!currentItem.sourceId) return null;

		const sourceAnchor = findAnchorById(currentItem.sourceId);
		if (sourceAnchor) {
			const position = findItemPosition(sourceAnchor.id);
			if (position) {
				navigationStore.focusedItemId = sourceAnchor.id;
				navigationStore.currentColumnIndex = position.columnIndex;
				navigationStore.currentItemIndex = position.itemIndex;
				return sourceAnchor.id;
			}
		}
		return null;
	};

	// Navigate to first anchor in target column
	const navigateToColumnAnchor = (newColumnIndex: number, grid: NavigationGrid): SankeyKey | null => {
		const targetColumn = grid.columns[newColumnIndex];
		if (targetColumn.items.length === 0) return null;

		const firstAnchor = targetColumn.items.find((item) => item.type === "anchor");
		if (firstAnchor) {
			const position = findItemPosition(firstAnchor.id);
			if (position) {
				navigationStore.focusedItemId = firstAnchor.id;
				navigationStore.currentColumnIndex = position.columnIndex;
				navigationStore.currentItemIndex = position.itemIndex;
				return firstAnchor.id;
			}
		}
		return null;
	};

	const getDocumentDirection = () => {
		return document.documentElement.dir;
	};

	const isRTLDirection = () => getDocumentDirection() === "rtl";

	// Handle directional navigation logic
	const handleDirectionalNavigation = (direction: "left" | "right", currentItem: NavigationItem): SankeyKey | null => {
		// In RTL, reverse the logical meaning of left/right
		const forwardDirection = isRTLDirection() ? "left" : "right";
		const backwardDirection = isRTLDirection() ? "right" : "left";

		if (direction === forwardDirection) {
			// Forward flow: anchor → path → target anchor
			if (currentItem.type === "anchor" && !currentItem.sourceId) {
				return navigateAnchorToPath(currentItem);
			} else if (currentItem.type === "path") {
				return navigatePathToAnchor(currentItem);
			}
		} else if (direction === backwardDirection) {
			// Backward flow: anchor ← path ← source anchor
			if (currentItem.type === "anchor" && !currentItem.sourceId) {
				return navigateAnchorToIncomingPath(currentItem);
			} else if (currentItem.type === "path") {
				return navigatePathToSourceAnchor(currentItem);
			}
		}
		return null;
	};

	// Navigate horizontally between columns
	const navigateHorizontal = (direction: "left" | "right"): SankeyKey | null => {
		const grid = getNavigationGrid();
		if (grid.columns.length === 0) return null;

		if (!navigationStore.focusedItemId) {
			return initializeFocus();
		}

		const currentItem = getCurrentFocusedItem();
		if (!currentItem) return null;

		// Try directional flow navigation first
		const flowResult = handleDirectionalNavigation(direction, currentItem);
		if (flowResult) return flowResult;

		// Default column-based navigation (respecting RTL)

		let delta: number;

		if (isRTLDirection()) {
			// In RTL: left moves forward (+1), right moves backward (-1)
			delta = direction === "left" ? 1 : -1;
		} else {
			// In LTR: right moves forward (+1), left moves backward (-1)
			delta = direction === "left" ? -1 : 1;
		}

		const newColumnIndex = navigationStore.currentColumnIndex + delta;

		if (newColumnIndex >= 0 && newColumnIndex < grid.columns.length) {
			return navigateToColumnAnchor(newColumnIndex, grid);
		}

		return null;
	};

	const getFirstFocusableItemId = (): SankeyKey | null => {
		const grid = getNavigationGrid();
		if (grid.columns.length > 0) {
			// Find the first anchor (not path) in the first column
			const firstAnchor = grid.columns[0].items.find((item) => item.type === "anchor");
			if (firstAnchor) {
				return firstAnchor.id;
			}
		}
		return null;
	};

	const initializeFocus = (): SankeyKey | null => {
		const firstItemId = getFirstFocusableItemId();
		if (firstItemId) {
			navigationStore.focusedItemId = firstItemId;
			navigationStore.currentColumnIndex = 0;
			navigationStore.currentItemIndex = 0;
		}
		return firstItemId;
	};

	// Clear focus
	const clearFocus = () => {
		navigationStore.focusedItemId = null;
	};

	return {
		get value() {
			return navigationStore;
		},
		getNavigationGrid,
		setFocusedItem,
		navigateVertical,
		navigateHorizontal,
		getFirstFocusableItemId,
		initializeFocus,
		clearFocus
	};
};

export const navigationStore = createNavigationStore();
