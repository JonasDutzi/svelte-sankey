export type Wrapper = {
	height: number;
	width: number;
	top: number;
	left: number;
};

class WrapperStore {
	data = $state<Wrapper>({
		height: 0,
		width: 0,
		top: 0,
		left: 0
	});

	get value() {
		return this.data;
	}

	get height() {
		return this.data.height;
	}

	get width() {
		return this.data.width;
	}

	get top() {
		return this.data.top;
	}

	get left() {
		return this.data.left;
	}

	set(value: Wrapper) {
		this.data = value;
	}
}

export const wrapperStore = new WrapperStore();
