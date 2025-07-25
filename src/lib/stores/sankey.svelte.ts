export type SankeyStore = {
	minPathHeight: number;
	maxPathHeight: number;
	minValue: number;
	maxValue: number;
	isLoading: boolean;
	highlightPaths?: boolean;
};

const createSankeyStore = () => {
	const sankeyStore = $state<SankeyStore>({
		minPathHeight: 1,
		maxPathHeight: 0,
		minValue: 0,
		maxValue: 0,
		isLoading: true,
		highlightPaths: true
	});

	const setMinValue = (value: number) => {
		sankeyStore.minValue = value;
	};

	const setMaxValue = (value: number) => {
		sankeyStore.maxValue = value;
	};

	const setHighlightPaths = (value: boolean) => {
		sankeyStore.highlightPaths = value;
	};

	const setMaxPathHeight = (value: number) => {
		sankeyStore.maxPathHeight = value;
	};

	const setMinPathHeight = (value: number) => {
		sankeyStore.minPathHeight = value;
	};

	return {
		get value() {
			return sankeyStore;
		},
		setMinValue,
		setMaxValue,
		setHighlightPaths,
		setMaxPathHeight,
		setMinPathHeight
	};
};

export const sankeyStore = createSankeyStore();
