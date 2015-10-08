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

        //public IEnumerable<PointOfInterest> Get()
        //{
        //    return _repo.Query<PointOfInterest>().ToList();
        //}

        public List<PointOfInterest> Get()
        {
            string currentUserName = User.Identity.Name;
            ApplicationUser currentUser = _repo.Query<ApplicationUser>().Where(p => p.UserName == currentUserName).FirstOrDefault();
            var userPOIs  = _repo.Query<PointOfInterest>().Where(p => p.User.Id == currentUser.Id).ToList();

            return userPOIs;
           
        }

        [HttpPost]
        public HttpResponseMessage Post(PointOfInterest poi)
        {

            if (ModelState.IsValid)
            {
                string currentUser = User.Identity.Name;

                PointOfInterest newPOI = new PointOfInterest
                {
                   
                    Place_id = poi.Place_id,
                    Name = poi.Name,
                    Address = poi.Address,
                    PhoneNum = poi.PhoneNum,
                    Rating = poi.Rating
                                                                   

                };

                //Find current logon user
                var targetUser = _repo.Query<ApplicationUser>().Include(t => t.UserSavedPOIs).FirstOrDefault(t => t.UserName == currentUser);

                //Ensure we have List to hold saved POIs
                if (targetUser.UserSavedPOIs == null)
                {
                    targetUser.UserSavedPOIs = new List<PointOfInterest>();
                }                
                
                // Add newPOI to current logon user and add logon user to newPOI
                targetUser.UserSavedPOIs.Add(newPOI);
                newPOI.User = targetUser; 
                             
                _repo.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, poi);

            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, this.ModelState);
        }






        // DELETE: api/POI/5
        [HttpDelete]
        public void Delete(int id)
        {
            _repo.Delete<PointOfInterest>(id);
            _repo.SaveChanges();
        }
    }
}
