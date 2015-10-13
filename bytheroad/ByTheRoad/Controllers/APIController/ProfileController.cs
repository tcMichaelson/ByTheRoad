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
    public class ProfileController : ApiController
    {
        private IGenericRepository _repo;
        public ProfileController(IGenericRepository repo)
        {
            _repo = repo;
        }



        // GET: api/Profile/5
        public ApplicationUser Get()
        {
            //stays here in controller
            var curr = (from u in _repo.Query<ApplicationUser>()
                        where u.UserName == User.Identity.Name
                        select u).SingleOrDefault();

            return curr; }

            public HttpResponseMessage Post(ApplicationUser user)
        {

            if (ModelState.IsValid)
            {
                if (user.Id == null)
                {
                    _repo.Add<ApplicationUser>(user);
                    _repo.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, user);

                }
                else
                {
      
            var userToUpdate = _repo.Query<ApplicationUser>().Where(m => m.UserName == User.Identity.Name).FirstOrDefault();
            userToUpdate.FirstName = user.FirstName;
            userToUpdate.LastName = user.LastName;
            
            

            _repo.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, user);
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, this.ModelState);
            }
        }

       [HttpDelete]
        public HttpResponseMessage DeleteProfile(string Id)
        {
            
            if (ModelState.IsValid)
            {

                var savedPlaces = _repo.Query<PointOfInterest>().Where(m => m.User.Id == Id).ToList();
                
                foreach(var place in savedPlaces)
                {
                    _repo.Delete<PointOfInterest>(place.Id);
                }

                _repo.Delete<ApplicationUser>(Id);
                _repo.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK);
                }
            

                return new HttpResponseMessage(HttpStatusCode.OK);
            
        }
    }
}

