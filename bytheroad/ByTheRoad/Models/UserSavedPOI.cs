using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ByTheRoad.Models
{
    public class UserSavedPOI
    {
        public string Id { get; set; }
        public ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public PointOfInterest POI  { get; set; }
        public string POIId { get; set; }
        public bool Favorite { get; set; }

    }
}