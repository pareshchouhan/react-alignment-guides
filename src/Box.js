import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { calculateBoundaries } from './utils/helpers';
import { RESIZE_HANDLES } from './utils/constants';
import styles from './styles.scss';

class Box extends PureComponent {
	constructor(props) {
		super(props);
		this.box = React.createRef();
		this.coordinates = React.createRef();
		this.height = React.createRef();
		this.onDragStart = this.onDragStart.bind(this);
		this.shortcutHandler = this.shortcutHandler.bind(this);
		this.onResizeStart = this.onResizeStart.bind(this);
		this.getCoordinatesWrapperWidth = this.getCoordinatesWrapperWidth.bind(this);
		this.getDimensionsWrapperWidth = this.getDimensionsWrapperWidth.bind(this);
	}

	onDragStart(e) {
		e.stopPropagation();
		const target = this.box.current;
		const boundingBox = this.props.getBoundingBoxElement();
		const startingPosition = target.getBoundingClientRect().toJSON();
		const boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
		const data = {
			x: startingPosition.x - boundingBoxPosition.x,
			y: startingPosition.y - boundingBoxPosition.y,
			top: startingPosition.y - boundingBoxPosition.y,
			left: startingPosition.x - boundingBoxPosition.x,
			width: startingPosition.width,
			height: startingPosition.height,
			node: target
		};
		this.props.onDragStart && this.props.onDragStart(e, data);

		const deltaX = Math.abs(target.offsetLeft - e.clientX);
		const deltaY = Math.abs(target.offsetTop - e.clientY);

		const onDrag = (e) => {
			if (this.props.dragging) {
				const boundingBox = this.props.getBoundingBoxElement();
				const boundingBoxDimensions = boundingBox.current.getBoundingClientRect().toJSON();
				const boxWidth = this.props.position.width;
				const boxHeight = this.props.position.height;
				const left = e.clientX - deltaX;
				const top = e.clientY - deltaY;

				const currentPosition = calculateBoundaries(left, top, boxWidth, boxHeight, boundingBoxDimensions);
				const data = {
					x: currentPosition.left,
					y: currentPosition.top,
					top: currentPosition.top,
					left: currentPosition.left,
					width: this.props.position.width,
					height: this.props.position.height,
					node: this.box.current
				};

				this.props.onDrag && this.props.onDrag(e, data);
			}
		};

		const onDragEnd = (e) => {
			if (this.props.dragging) {
				const endPosition = {
					left: e.clientX - deltaX,
					top: e.clientY - deltaY
				};
				const data = {
					x: endPosition.left,
					y: endPosition.top,
					top: endPosition.top,
					left: endPosition.left,
					width: this.props.position.width,
					height: this.props.position.height,
					node: this.box.current
				};
				this.props.onDragEnd && this.props.onDragEnd(e, data);
				document.removeEventListener('mousemove', onDrag);
				document.removeEventListener('mouseup', onDragEnd);
			}
		};

		document.addEventListener('mousemove', onDrag);
		document.addEventListener('mouseup', onDragEnd);
	}

	shortcutHandler(e) {
		if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowRight') {
			this.setState({
				left: this.state.left + 1
			});
		} else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowRight') {
			this.setState({
				left: this.state.left + 10
			});
		} else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowLeft') {
			this.setState({
				left: this.state.left - 1
			});
		} else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowLeft') {
			this.setState({
				left: this.state.left - 10
			});
		} else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowUp') {
			this.setState({
				top: this.state.top - 1
			});
		} else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowUp') {
			this.setState({
				top: this.state.top - 10
			});
		} else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowDown') {
			this.setState({
				top: this.state.top + 1
			});
		} else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowDown') {
			this.setState({
				top: this.state.top + 10
			});
		} else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowRight') {
			this.setState({
				width: this.state.width + 1
			});
		} else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowRight') {
			this.setState({
				width: this.state.width + 10
			});
		} else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowLeft') {
			this.setState({
				width: this.state.width - 1
			});
		} else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowLeft') {
			this.setState({
				width: this.state.width - 10
			});
		} else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowDown') {
			this.setState({
				height: this.state.height + 1
			});
		} else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
			this.setState({
				height: this.state.height + 10
			});
		} else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowUp') {
			this.setState({
				height: this.state.height - 1
			});
		} else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
			this.setState({
				height: this.state.height - 10
			});
		}
	}

	onResizeStart(e) {
		e.stopPropagation();
		const { target } = e;
		const boundingBox = this.props.getBoundingBoxElement();
		const startingDimensions = this.box.current.getBoundingClientRect().toJSON();
		const boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
		const data = {
			width: startingDimensions.width,
			height: startingDimensions.height,
			x: startingDimensions.left - boundingBoxPosition.x,
			y: startingDimensions.top - boundingBoxPosition.y,
			left: startingDimensions.left - boundingBoxPosition.x,
			top: startingDimensions.top - boundingBoxPosition.y,
			node: this.box.current
		};
		this.props.onResizeStart && this.props.onResizeStart(e, data);
		const deltaX = target.offsetLeft - e.clientX;
		const deltaY = target.offsetTop - e.clientY;

		const onResize = (e) => {
			if (this.props.resizing) {
				if (target.id === 'br') {
					const currentDimensions = {
						width: e.clientX - startingDimensions.left,
						height: e.clientY - startingDimensions.top
					};

					const data = {
						width: currentDimensions.width,
						height: currentDimensions.height,
						x: startingDimensions.left - boundingBoxPosition.x,
						y: startingDimensions.top - boundingBoxPosition.y,
						left: startingDimensions.left - boundingBoxPosition.x,
						top: startingDimensions.top - boundingBoxPosition.y,
						node: this.box.current
					};
					this.props.onResize && this.props.onResize(e, data);
				} else if (target.id === 'bl') {
					const deltaX = startingDimensions.left - e.clientX;
					const deltaY = startingDimensions.top + startingDimensions.height - e.clientY;
					const currentDimensions = {
						width: startingDimensions.width + deltaX,
						height: startingDimensions.height - deltaY
					};

					const currentPosition = {
						top: startingDimensions.top,
						left: startingDimensions.left - deltaX
					};

					const data = {
						width: currentDimensions.width,
						height: currentDimensions.height,
						x: currentPosition.left - boundingBoxPosition.x,
						y: currentPosition.top - boundingBoxPosition.y,
						left: currentPosition.left - boundingBoxPosition.x,
						top: currentPosition.top - boundingBoxPosition.y,
						node: this.box.current
					};
					this.props.onResize && this.props.onResize(e, data);
				} else if (target.id === 'tr') {
					const deltaX = e.clientX - startingDimensions.left;
					const deltaY = startingDimensions.top - e.clientY;
					const currentDimensions = {
						width: deltaX,
						height: startingDimensions.height + deltaY
					};

					const currentPosition = {
						top: startingDimensions.top - deltaY,
						left: startingDimensions.left
					};

					const data = {
						width: currentDimensions.width,
						height: currentDimensions.height,
						x: currentPosition.left - boundingBoxPosition.x,
						y: currentPosition.top - boundingBoxPosition.y,
						left: currentPosition.left - boundingBoxPosition.x,
						top: currentPosition.top - boundingBoxPosition.y,
						node: this.box.current
					};
					this.props.onResize && this.props.onResize(e, data);
				} else if (target.id === 'tl') {
					const deltaX = startingDimensions.left - e.clientX;
					const deltaY = startingDimensions.top - e.clientY;
					const currentDimensions = {
						width: startingDimensions.width + deltaX,
						height: startingDimensions.height + deltaY
					};

					const currentPosition = {
						top: startingDimensions.top - deltaY,
						left: startingDimensions.left - deltaX
					};
					const data = {
						width: currentDimensions.width,
						height: currentDimensions.height,
						x: currentPosition.left - boundingBoxPosition.x,
						y: currentPosition.top - boundingBoxPosition.y,
						left: currentPosition.left - boundingBoxPosition.x,
						top: currentPosition.top - boundingBoxPosition.y,
						node: this.box.current
					};
					this.props.onResize && this.props.onResize(e, data);
				}
			}
		};

		const onResizeEnd = (e) => {
			if (this.props.resizing) {
				document.removeEventListener('mousemove', onResize);
				document.removeEventListener('mouseup', onResizeEnd);

				const dimensions = this.box.current.getBoundingClientRect().toJSON();
				const data = {
					width: dimensions.width,
					height: dimensions.height,
					y: dimensions.top - boundingBoxPosition.y,
					x: dimensions.left - boundingBoxPosition.x,
					top: dimensions.top - boundingBoxPosition.y,
					left: dimensions.left - boundingBoxPosition.x,
					node: this.box.current
				};
				this.props.onResizeEnd && this.props.onResizeEnd(e, data);
			}
		};

		document.addEventListener('mousemove', onResize);
		document.addEventListener('mouseup', onResizeEnd);
	}

	getCoordinatesWrapperWidth() {
		if (this.props.isSelected && this.coordinates && this.coordinates.current) {
			return this.coordinates.current.offsetWidth;
		}
	}

	getDimensionsWrapperWidth() {
		if (this.props.isSelected && this.height && this.height.current) {
			return this.height.current.offsetWidth;
		}
	}

	render() {
		const { biggestBox, boxStyle, id, isSelected, position } = this.props;
		let boxClassNames = isSelected ? `${styles.box} ${styles.selected}` : styles.box;
		boxClassNames = biggestBox === id ? `${boxClassNames} ${styles.biggest}` : boxClassNames;
		const boxStyles = {
			...boxStyle,
			width: `${position.width}px`,
			height: `${position.height}px`,
			top: `${position.top}px`,
			left: `${position.left}px`
		};

		return <div
			className={boxClassNames}
			id={id}
			onMouseUp={this.props.selectBox}
			onMouseDown={this.onDragStart}
			onKeyUp={this.shortcutHandler}
			onKeyDown={this.shortcutHandler}
			ref={this.box}
			style={boxStyles}
			tabIndex="0"
		>
			{
				isSelected ?
					<span
						ref={this.coordinates}
						className={styles.coordinates}
						style={{ left: `-${this.getCoordinatesWrapperWidth() + 10}px` }}
					>
						{`${position.left}, ${position.top}`}
					</span> :
					null
			}
			{
				isSelected ?
					<span className={`${styles.dimensions} ${styles.width}`} style={{ width: `${position.width}px` }}>{position.width}</span> :
					null
			}
			{
				isSelected ?
					<span
						className={`${styles.dimensions} ${styles.height}`}
						ref={this.height}
						style={{ height: `${position.height}px`, left: `-${this.getDimensionsWrapperWidth() + 10}px` }}
					>
						{position.height}
					</span> :
					null
			}
			{
				isSelected ?
					RESIZE_HANDLES.map(handle => {
						const className = `${styles.resizeHandle} ${styles[`resize-${handle}`]}`;
						return <div key={handle} className={className} onMouseDown={this.onResizeStart} id={handle} />
					}) :
					null
			}
		</div>;
	}
}

Box.propTypes = {
	biggestBox: PropTypes.string,
	drag: PropTypes.bool,
	getBoundingBoxElement: PropTypes.func,
	id: PropTypes.string,
	isSelected: PropTypes.bool,
	keybindings: PropTypes.bool,
	onRotateStart: PropTypes.func,
	onRotate: PropTypes.func,
	onRotateEnd: PropTypes.func,
	onResizeStart: PropTypes.func,
	onResize: PropTypes.func,
	onResizeEnd: PropTypes.func,
	onDragStart: PropTypes.func,
	onDrag: PropTypes.func,
	onDragEnd: PropTypes.func,
	position: PropTypes.object.isRequired,
	resize: PropTypes.bool,
	rotate: PropTypes.bool
};

export default Box;