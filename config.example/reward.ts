import type { RewardConfig } from "@/utils/types";

export const rewardConfig: RewardConfig = {
  icon: "/images/rewards/reward.svg",
  text: "给我买杯咖啡",
  dialog_title: "赞赏支持，更有情怀",
  dialog_description: "感谢支持，交个朋友，多少随意",
  data: [
    {
      type: "微信",
      icon: "/images/rewards/wechat.svg",
      url: "https://blog.zwying.com/usr/uploads/sina/63adb5ebda126.jpg"
    },
    {
      type: "支付宝",
      icon: "/images/rewards/alipay.svg",
      url: "https://blog.zwying.com/usr/uploads/sina/63adb5ebd2df1.jpg"
    },
    {
      type: "QQ",
      icon: "/images/rewards/QQ.svg",
      url: "https://blog.zwying.com/usr/uploads/sina/63adb5ebe2ac9.jpg"
    }
  ]
};