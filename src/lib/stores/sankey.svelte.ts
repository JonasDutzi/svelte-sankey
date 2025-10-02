export type Sankey = {
	minPathHeight: number;
	maxPathHeight: number;
	minValue: number;
	maxValue: number;
	isLoading: boolean;
	highlightPaths?: boolean;
};

class SankeyStore {
	data = $state<Sankey>({
		minPathHeight: 1,
		maxPathHeight: 0,
		minValue: 0,
		maxValue: 0,
		isLoading: true,
		highlightPaths: true
	});

	get minPathHeight() {
		return this.data.minPathHeight;
	}

	set minPathHeight(value: number) {
		this.data.minPathHeight = value;
	}

	get maxPathHeight() {
		return this.data.maxPathHeight;
	}

	set maxPathHeight(value: number) {
		this.data.maxPathHeight = value;
	}

	get minValue() {
		return this.data.minValue;
	}

	set minValue(value: number) {
		this.data.minValue = value;
	}

	get maxValue() {
		return this.data.maxValue;
	}

	set maxValue(value: number) {
		this.data.maxValue = value;
	}

	get isLoading() {
		return this.data.isLoading;
	}

	set isLoading(value: boolean) {
		this.data.isLoading = value;
	}

	get highlightPaths() {
		return this.data.highlightPaths;
	}

	set highlightPaths(value: boolean | undefined) {
		this.data.highlightPaths = value;
	}

	set(value: Sankey) {
		this.data = value;
	}

	setLoading(value: boolean) {
		this.data.isLoading = value;
	}

	update(updater: (current: Sankey) => Sankey) {
		this.data = updater(this.data);
	}

	reset() {
		this.data = {
			minPathHeight: 1,
			maxPathHeight: 0,
			minValue: 0,
			maxValue: 0,
			isLoading: true,
			highlightPaths: true
		};
	}
}

export const sankeyStore = new SankeyStore();
