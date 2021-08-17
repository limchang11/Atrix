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
			"product_id"       : { type: DataTypes.CHAR(36),    primaryKey: true, allowNull: false },
            "user_id"          : { type: DataTypes.CHAR(36), primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4  },
            "quantity"         : { type:DataTypes.INTEGER,     allowNull: false, defaultValue: 1}
		}, {
			"sequelize": database,
			"modelName": "Cart",
			"hooks"    : {
				"afterUpdate": Products._auto_update_timestamp
			}
		});
	}
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}
}
