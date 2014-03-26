Sample of a data record's metadata schema
{
	_id: ObjectID
	_metadata:{
		creator:{
			id:{
	            type: ObjectId,
	            ref: "cubi.user.User",
	            required: true
	        },
	        timestamp: {
	            type: Date,
	            default: Date.now
	        }
		},
		updates:[
			{
				id:{
		            type: ObjectId,
		            ref: "cubi.user.User",
		            required: true
		        },
		        timestamp: {
		            type: Date,
		            default: Date.now
		        }
				change:{
					action: {
						type: String,
						enum:["ADD","DELETE","CHANGE"]
					}
					path: String
					original: String
					current: String
				}
			}
		],
		ownership:{
			ownerId:{ //本数据所有者（可以不是创建者，默认为创建者）
		            type: ObjectId,
		            ref: "cubi.user.User",
		            required: true
		        },
			accountId:{
		            type: ObjectId,
		            ref: "cubi.account.Account",
		            required: true
		        }
		},
		visibility:{ //数据可视性范围， 全局（跨企业），本企业内，只有数据所有者（可以不是创建者）
			scope:{ 	
				type:String,
				enum:["GLOBAL","ACCOUNT","OWNER"]
			}
		},
		ACL:[	//访问控制列表，除了默认的可视性以外 本列表声明的特殊用户对本条数据的权限仍然有效
			id:{
	            type: ObjectId,
	            ref: "cubi.user.User",
	            required: true
	        },
	        permission:{
				type:String,
				enum:["ACCESS","MANAGE"]
			}
		]
	}

}


// in metadata of appbuilder , the config options are below
{

	features:{
		enableMetadata:true,
		enableDataACL:true,
		enableLogDataChange:true,		
		defaults:{
			visibility:{
				scope:"ACCOUNT"
			}
		}
	}

}