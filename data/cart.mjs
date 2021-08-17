import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;

export class Cart extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		Cart.init({
            "uuid"             : { type: DataTypes.CHAR(36), 	primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            "user_id"          : { type: DataTypes.CHAR(36), 	allowNull: false, defaultValue: DataTypes.UUIDV4  },
			"product_id"       : { type: DataTypes.CHAR(36),  	allowNull: false },
            "product_name"     : { type: DataTypes.STRING(64),  allowNull: false },
            "product_price"    : { type: DataTypes.FLOAT,     	allowNull: false },
		}, {
			"sequelize": database,
			"modelName": "Cart",
			"hooks"    : {
				"afterUpdate": Cart._auto_update_timestamp
			}
		});
	}
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}
}
