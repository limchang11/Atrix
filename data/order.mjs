import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;

export class Order extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		Order.init({
            "uuid"             : { type: DataTypes.CHAR(36), 	primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            "user_id"          : { type: DataTypes.CHAR(36), 	allowNull: false, defaultValue: DataTypes.UUIDV4  },
			"order_id"       : { type: DataTypes.CHAR(36),  	allowNull: false },
            "order_name"     : { type: DataTypes.STRING(64),  allowNull: false },
            "order_price"    : { type: DataTypes.FLOAT,     	allowNull: false },
			"order_qty"	   : { type:DataTypes.INTEGER,     allowNull: false, defaultValue: 1},
		}, {
			"sequelize": database,
			"modelName": "Order",
			"hooks"    : {
				"afterUpdate": Order._auto_update_timestamp
			}
		});
	}
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}
}
