using ByTheRoad.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ByTheRoad.Controllers.APIController
{
    public class ProfileController : ApiController
    {
        private IGenericRepository _repo;
        public ProfileController(IGenericRepository repo)
        {
            _repo = repo;
        }

        public IEnumerable<ApplicationUser> GetReviews()
        {
            return _repo.Query<ApplicationUser>().ToList();
        }

        public void AddReview(ApplicationUser user)
        {
            _repo.Add(user);
            _repo.SaveChanges();
        }



        // GET: api/Profile/5
        public ApplicationUser Get()
        {
            return _repo.Query<ApplicationUser>().FirstOrDefault();
        }

        // POST: api/Profile
        public void Post(ApplicationUser user)
        {
            var userToUpdate = _repo.Query<ApplicationUser>().Where(m => m.UserName == User.Identity.Name).FirstOrDefault();
            userToUpdate.FirstName = user.FirstName;
            userToUpdate.LastName = user.LastName;
            userToUpdate.ShowFirstName = user.ShowFirstName;
            userToUpdate.ShowLastName = user.ShowLastName;
            userToUpdate.ShowUserName = user.ShowUserName;

            _repo.SaveChanges();
        }

        // DELETE: api/Profile/5
        public void Delete(int id)
        {
            
        }
    }
}
