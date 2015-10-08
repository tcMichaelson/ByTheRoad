namespace ByTheRoad.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updatedPOI : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PointOfInterests", "Address", c => c.String());
            AddColumn("dbo.PointOfInterests", "PhoneNum", c => c.String());
            AddColumn("dbo.PointOfInterests", "Rating", c => c.String());
            AddColumn("dbo.PointOfInterests", "Distance", c => c.Int(nullable: false));
            DropColumn("dbo.PointOfInterests", "Description");
            DropColumn("dbo.PointOfInterests", "Longitude");
            DropColumn("dbo.PointOfInterests", "Latitude");
        }
        
        public override void Down()
        {
            AddColumn("dbo.PointOfInterests", "Latitude", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.PointOfInterests", "Longitude", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.PointOfInterests", "Description", c => c.String());
            DropColumn("dbo.PointOfInterests", "Distance");
            DropColumn("dbo.PointOfInterests", "Rating");
            DropColumn("dbo.PointOfInterests", "PhoneNum");
            DropColumn("dbo.PointOfInterests", "Address");
        }
    }
}
