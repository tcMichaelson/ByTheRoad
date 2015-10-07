using ByTheRoad.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ByTheRoad.Controllers.APIController
{
   
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

        //public PointOfInterest Get(int Id)
        //{
        //    return _repo.Find<PointOfInterest>(Id);
        //}

        [HttpPost]
        public HttpResponseMessage Post(string placeId)
        {
            Console.WriteLine("API hit");

            if (ModelState.IsValid)
            {
                string currentUser = User.Identity.Name;
                //POI.Id = "ChIJN1t_tDeuEmsRUsoyG83frY4";

                PointOfInterest newPOI = new PointOfInterest
                {
                    Id = placeId
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
                return Request.CreateResponse(HttpStatusCode.OK, placeId);

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
