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
        [Route ("api/POI")]
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
                _repo.Add<PointOfInterest>(POI);
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
