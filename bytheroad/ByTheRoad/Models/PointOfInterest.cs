using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ByTheRoad.Models
{
    public class PointOfInterest
    {

        public int Id { get; set; }
        public string Place_id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Vicinity { get; set; }
        public string PhoneNum { get; set; }
        public double? Rating { get; set; }
        public ApplicationUser User { get; set; }
    }
}
