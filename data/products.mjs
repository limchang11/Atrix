import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;

export class Products extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		Products.init({
			"uuid"       : { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"name"       : { type: DataTypes.STRING(64), allowNull: false },
			"description": { type: DataTypes.STRING(64), allowNull: false },
			"price"      : { type: DataTypes.DECIMAL(5,2), allowNull: false }
		}, {
			"sequelize": database,
			"modelName": "Products",
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
