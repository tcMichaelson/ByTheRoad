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

        // GET: api/POI
        public IEnumerable<PointOfInterest> GetPOI()
        {
            return _repo.Query<PointOfInterest>().ToList(); 
        }

        
        // POST: api/POI
        [HttpPost]
        [Route ("api/POI",Name ="POIApi")]
        public void AddPOI(PointOfInterest POI)
        {
            _repo.Add(POI);
            _repo.SaveChanges(); 
        }

        public IEnumerable<PointOfInterest> Get()
        {
            return _repo.Query<PointOfInterest>().ToList();
        }
        public PointOfInterest Get(int Id)
        {
            return _repo.Find<PointOfInterest>(Id);
        }

        public HttpResponseMessage Post(PointOfInterest POI)
        {
            if (ModelState.IsValid)
            {

                string currentUser = User.Identity.Name;
                POI.Id = "ChIJN1t_tDeuEmsRUsoyG83frY4";

                PointOfInterest newPOI = new PointOfInterest
                {
                    Id = POI.Id
                };

                //Find current logon user
                var targetUser = _repo.Query<ApplicationUser>().Include(t => t.UserSavedPOIs).FirstOrDefault(t => t.UserName == currentUser);

                // Add newPOI to current logon user and add logon user to newPOI
                targetUser.UserSavedPOIs.Add(newPOI);
                newPOI.User = targetUser; 
                             
                _repo.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, POI);

            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, this.ModelState);
        }






        // DELETE: api/POI/5
        public void Delete(int id)
        {
            _repo.Delete<PointOfInterest>(id);
            _repo.SaveChanges();
        }
    }
}
