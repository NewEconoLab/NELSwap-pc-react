/**
 * checkbox
 */
import * as React from 'react';
import './index.less';
import selected from '@/img/tick.png';
import unselect from '@/img/select-no.png';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import common from '@/store/common';

interface IProps
{
    onClick?: (call: boolean) => void,
    style?: object,
    disabled?: boolean, // 按钮是否禁止点击
    text: string,
}
@inject('common')
@observer
export default class Checkbox extends React.Component<IProps, {}>
{
    public state = {
        value: false
    };
    constructor(props: IProps)
    {
        super(props);
    }
    // 监控输入内容
    public onClick = () =>
    {
        if (this.props.disabled)
        {
            this.setState({
                value: false
            })
        }
        else
        {
            if (!common.address)
            {
                common.login();
                if (this.props.onClick)
                {
                    this.props.onClick(false);
                }
                 return
            }
            this.setState({
                value: !this.state.value
            },
                () =>
                {
                    if (this.props.onClick)
                    {
                        this.props.onClick(this.state.value);
                    }
                })
        }
    }
    public render()
    {
        const text = classNames("text", { "active": this.state.value })
        return (
            <div className="checkbox-wrapper" onClick={this.onClick}>
                <div className="box" >
                    {
                        this.state.value ?
                            <img src={selected} width={14} /> :
                            <img src={unselect} height={14} />
                    }
                </div>
                <div className={text} style={this.props.style}>{this.props.text}</div>
            </div>
        );
    }
}
