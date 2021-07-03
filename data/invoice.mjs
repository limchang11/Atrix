import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;

export class Invoices extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		Invoices.init({
			"uuid"       : { type: DataTypes.CHAR(36),    primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"invoiceDate": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"name"       : { type: DataTypes.STRING(64),  allowNull: false },
			"description": { type: DataTypes.STRING(64),  allowNull: false },
			"quantity"      : { type: DataTypes.CHAR(5),  allowNull: false } ,
			"price"       : { type: DataTypes.CHAR(36),    primaryKey: true, defaultValue: DataTypes.UUIDV4 }
		}, {
			"sequelize": database,
			"modelName": "invoices",
			"hooks"    : {
				"afterUpdate": Invoic._auto_update_timestamp
			}
		});
	}
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}
}
s