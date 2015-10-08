using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ByTheRoad.Models
{
    public class PointOfInterest
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string PhoneNum { get; set; }
        public string Rating { get; set; }
        public int    Distance { get; set; }
        public ApplicationUser User { get; set; }
    }
}