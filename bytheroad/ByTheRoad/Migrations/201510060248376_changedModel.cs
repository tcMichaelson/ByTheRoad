namespace ByTheRoad.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changedModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PointOfInterests",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                        Description = c.String(),
                        Longitude = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Latitude = c.Decimal(nullable: false, precision: 18, scale: 2),
                        User_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id)
                .Index(t => t.User_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PointOfInterests", "User_Id", "dbo.AspNetUsers");
            DropIndex("dbo.PointOfInterests", new[] { "User_Id" });
            DropTable("dbo.PointOfInterests");
        }
    }
}
