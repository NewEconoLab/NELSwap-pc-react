// 输入框组件
import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.less';

interface IProps {
	placeholder: string,
	status?: string,
	message?: string,
	value: string,
	onChange: (event: any) => void,
	onFocus?: () => void,
	style?: object,
	readonly?: boolean,
	type: string,
	onBlur?: (event: any) => void,
	topsearch?: boolean,
	onEnter?: () => void, 
	codeInput?:boolean,// 验证码的输入样式
	styleType?:'head'|'small'|'domain'|'onfous', // 输入框的样式选择 
	onCancelSearch?:() => void // 取消搜索
}

@observer
export default class Search extends React.Component<IProps, any> {
	public state ={
		isFocus:false
	}
	public inputRef:React.RefObject<HTMLInputElement> = React.createRef();
	private timer:number = 0;
	// 监控输入内容
	public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (this.props.onChange) {
			this.props.onChange(event.target.value);
		}
	}
	// 失去焦点事件
	public onInputBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
		const value = ev.target.value;
		this.timer = window.setTimeout(() => {
			if (this.props.onBlur) {
				this.props.onBlur(value);
			}		
			this.setState({
				isFocus:false
			})
		}, 200)
	}
	// 监控焦点
	public onFocus = () => {
		if(this.timer !== 0) {
			clearTimeout(this.timer);
		}
		if (this.props.onFocus) {
			this.props.onFocus();
		}
		this.setState({
			isFocus:true
		})
	}
	// 回车事件
	public onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.keyCode === 13) {
			if (this.props.onEnter) {
				this.props.onEnter();
			}
		}
	}
	public onClearInput = ()=>{
		if(this.props.onCancelSearch){
			this.props.onCancelSearch();
		}
		this.setState({
			isFocus:false
		})
	}
	public render() {
		const inputClassName = classnames('search-input-icon',this.props.styleType ?this.props.styleType:'')
		return (
			<div className="search-input-group">
				<input
					className={inputClassName}
					value={this.props.value}
					type={this.props.type}
					placeholder={this.props.placeholder}
					onChange={this.onInputChange}
					style={this.props.style}
					readOnly={this.props.readonly}
					onBlur={this.onInputBlur}
					onFocus={this.onFocus}
					onKeyDown={this.onKeyDown}
					ref={this.inputRef}
				/><img src={require('@/img/search2.png')} className="search-icon" alt="search.png"/>
				{/* {
					(this.state.isFocus || this.props.value )?<img src={require('@/img/close2.png')} onClick={this.onClearInput} className="search-icon" alt="close.png"/>
					:
				} */}
				
				
			</div>
		);
	}
}
