using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ByTheRoad.Models
{
    public class PointOfInterest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Longitude { get; set; }
        public decimal Latitude { get; set; }
        public ApplicationUser User { get; set; }
    }
}