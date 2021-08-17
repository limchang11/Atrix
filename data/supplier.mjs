import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;

export class Supplier extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		Supplier.init({
			"uuid"       : { type: DataTypes.CHAR(36),    primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"name"       : { type: DataTypes.STRING(64),  allowNull: false },
			"address"    : { type: DataTypes.STRING(64),  allowNull: false },
			"email"       : { type: DataTypes.STRING(64), allowNull: false },
		}, {
			"sequelize": database,
			"modelName": "Supplier",
			"hooks"    : {
				"afterUpdate": Supplier._auto_update_timestamp
			}
		});
	}
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}
}
