

export interface ICommonStore {
  language: string,
  message: any,
  network: string,
  isLoadTeemo:boolean,// 检测是否有Teemo钱包
  isLoginFlag:number,// 默认不显示,1表示未检查到teemo钱包,2为未登录钱包
  loginState:number,  // 登陆状态，用于显示登陆使用的 toast 0==不显示，1==正在登录，2==登录成功，3==登录失败
  exchangeType:'usd'|'cny',  // 当前汇率种类（USD/CNY）
  exchangePrice:number, // 当前汇率兑换GAS的费用
  toLoginState:(state:'close'|'succes'|'fail'|'login')=>void, // 关闭登陆时的toast
  initExchangeInfo:(type:string)=>void;  // 初始化费率什么的
  // recordtype: number,// 记录序号
  // alertNumber: number,// 弹窗序号
  // setFeeFlag: boolean, // 设置手续费
  // // login: WalletApi.App, // 登陆页插件
  address: string, // 当前地址
  isSetedAddress:boolean; // 已经set 过address （有没有值不一定， 只是做过这个操作了）
  // pubkey: Uint8Array; // 当前公钥
  // balances: IAccountBalanceStore,  // 账户余额的信息
  // diceConfig: IDiceConfig,
  // queryLoginInfo: () => WalletApi.LoginInfo,  // 获得登陆信息的接口
  // initLoginInfo: (content: HTMLElement) => void,  // 初始化登陆方法
  login: () => void,   // 显示登陆入口
  // initAccountBalance: () => Promise<boolean>,  // 初始化账户余额
  // loginOut: () => void, // 登出
  initLanguage:()=>void;// 初始化语言
  setLanguage:(msg: string)=>void;// 设置语言
  // getNNCBalance: () => Promise<boolean>, // 获取nnc资产
  // getCGASBalance: () => Promise<boolean>, // 获取cgas资产
  // getContract:() => Promise<boolean>, // 获取注册器资产
  // getBlockHeight:()=>Promise<boolean>, // 获取区块高度
  // updateAllData:()=>Promise<boolean>, // 更新所有
  // setTimeGetBlock:()=>Promise<boolean>, // 定时请求高度
  getSessionAddress:()=>void // 获取登陆态
}
export interface ICommonProps{
  common:ICommonStore
}
export interface ILoginParam{
  address:string,
  label:string
}

export interface IAccountBalanceStore {
  contractnnc: number;  // 合约账户NNC余额
  contractcgas: number; // 合约账户CGAS余额
  nnc: number;  // 当前账户NNC余额
  cgas: number; // 当前账户CGAS余额
}

export class AccountBalance {
  public contractnnc: number;  // 合约账户NNC余额
  public contractcgas: number; // 合约账户CGAS余额
  public nnc: number;  // 当前账户NNC余额
  public cgas: number; // 当前账户CGAS余额
  constructor() {
    this.contractcgas = 0;
    this.contractnnc = 0;
    this.nnc = 0;
    this.cgas = 0;
  }
}