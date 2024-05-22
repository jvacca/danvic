export default function loadUserSettings(req, res) {
  res.status(200).json({
    "_id": "653011c63d608ccce6062c1a",
    "userid": "jcvacca@gmail.com",
    "wallets": [
        {
            "address": "0x62b3012e34f4d8edce700018ee48f1e270242699",
            "chain": "0x1",
            "wallet_name": "macys",
            "isConnected": false
        },
        {
            "address": "0xaCC44E9619Dc66C361A57e3CeDC12Ab10b2fC798",
            "chain":  "0x1",
            "wallet_name": "metamask",
            "isConnected": false
        }
    ],
    "default_wallet": {
        "address": "0x62b3012e34f4d8edce700018ee48f1e270242699",
        "chain": "0x1",
        "wallet_name": "macys"
    },
    "notifications_preferences": {
        "enable_marketing_email_notifications": "false"
    },
    "notifications": [],
    "createdAt": "2023-10-18T17:11:34.923Z",
    "__v": 0,
    "username": "letsgo5"
  })
}