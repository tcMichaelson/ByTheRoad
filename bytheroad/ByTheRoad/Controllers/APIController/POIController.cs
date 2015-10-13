using ByTheRoad.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ByTheRoad.Controllers.APIController
{
    [Authorize]
    public class POIController : ApiController
    {
        private IGenericRepository _repo;

        public POIController(GenericRepository repo)
        {
            _repo = repo;
        }

        public ICollection<PointOfInterest> Get()
        {

            string currentUserName = User.Identity.Name;
            ApplicationUser currentUser = _repo.Query<ApplicationUser>().Include(c => c.UserSavedPOIs).Where(p => p.UserName == currentUserName).FirstOrDefault();
            var userPOIs = currentUser.UserSavedPOIs;

            return userPOIs;

        }

        [HttpPost]
        public HttpResponseMessage Post(PointOfInterest poi)
        {
            PointOfInterest result;

            if (ModelState.IsValid)
            {
                //Get current logon user
                string currentUserName = User.Identity.Name;
                ApplicationUser targetUser = _repo.Query<ApplicationUser>().Include(t => t.UserSavedPOIs).Where(p => p.UserName == currentUserName).FirstOrDefault();

                //Ensure we have a List to hold saved POIs
                if (targetUser.UserSavedPOIs == null)
                {
                    targetUser.UserSavedPOIs = new List<PointOfInterest>();
                }

                PointOfInterest newPOI = new PointOfInterest
                {

                    Place_id = poi.Place_id,
                    Name = poi.Name,
                    Address = poi.Address,
                    Vicinity = poi.Vicinity,
                    PhoneNum = poi.PhoneNum,
                    Rating = poi.Rating,

                };

                // Add newPOI to current logon user and add logon user to newPOI
                targetUser.UserSavedPOIs.Add(newPOI);
                newPOI.User = targetUser;
                _repo.SaveChanges();
                result = newPOI;

                return Request.CreateResponse(HttpStatusCode.OK, result);
            }

            return Request.CreateResponse(HttpStatusCode.BadRequest);

        }

        // DELETE: api/POI/5
        [HttpDelete]
        [Route("api/poi/{place_id}")]
        public HttpResponseMessage Delete(string place_id)
        {
            PointOfInterest result;

            if (ModelState.IsValid)
            {
                //Get current logon user
                string currentUserName = User.Identity.Name;
                ApplicationUser targetUser = _repo.Query<ApplicationUser>().Include(t => t.UserSavedPOIs).Where(p => p.UserName == currentUserName).FirstOrDefault();

                // Check if poi exist
                // Find POI
                var targetPOI = targetUser.UserSavedPOIs.Where(m => m.Place_id == place_id).FirstOrDefault();
                targetUser.UserSavedPOIs.Remove(targetPOI);
                _repo.Delete<PointOfInterest>(targetPOI.Id);

                _repo.SaveChanges();
                result = targetPOI;

                return Request.CreateResponse(HttpStatusCode.OK, result);
            }

            return Request.CreateResponse(HttpStatusCode.BadRequest);

        }
    }
}
