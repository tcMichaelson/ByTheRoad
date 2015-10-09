namespace ByTheRoad.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class initial : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("dbo.PointOfInterests");
            AddColumn("dbo.PointOfInterests", "Description", c => c.String());
            AddColumn("dbo.PointOfInterests", "Longitude", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.PointOfInterests", "Latitude", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AlterColumn("dbo.PointOfInterests", "Id", c => c.String(nullable: false, maxLength: 128));
            AddPrimaryKey("dbo.PointOfInterests", "Id");
            DropColumn("dbo.PointOfInterests", "Place_id");
            DropColumn("dbo.PointOfInterests", "Address");
            DropColumn("dbo.PointOfInterests", "PhoneNum");
            DropColumn("dbo.PointOfInterests", "Rating");
        }
        
        public override void Down()
        {
            AddColumn("dbo.PointOfInterests", "Rating", c => c.Double());
            AddColumn("dbo.PointOfInterests", "PhoneNum", c => c.String());
            AddColumn("dbo.PointOfInterests", "Address", c => c.String());
            AddColumn("dbo.PointOfInterests", "Place_id", c => c.String());
            DropPrimaryKey("dbo.PointOfInterests");
            AlterColumn("dbo.PointOfInterests", "Id", c => c.Int(nullable: false, identity: true));
            DropColumn("dbo.PointOfInterests", "Latitude");
            DropColumn("dbo.PointOfInterests", "Longitude");
            DropColumn("dbo.PointOfInterests", "Description");
            AddPrimaryKey("dbo.PointOfInterests", "Id");
        }
    }
}
