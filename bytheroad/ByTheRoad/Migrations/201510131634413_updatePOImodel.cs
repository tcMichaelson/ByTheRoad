namespace ByTheRoad.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updatePOImodel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PointOfInterests", "Vicinity", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.PointOfInterests", "Vicinity");
        }
    }
}
