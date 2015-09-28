using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.Validation;
using System.Linq;
using System.Linq.Expressions;
using System.Web;

namespace ByTheRoad.Models
{
    public class GenericRepository : IGenericRepository
    {
        private ApplicationDbContext _db;
        public GenericRepository(ApplicationDbContext db)
        {
            _db = db;
        }
        public IQueryable<T> Query<T>() where T : class
        {
            return _db.Set<T>().AsQueryable();
        }
        public T Find<T>(params object[] keyValues) where T : class
        {
            return _db.Set<T>().Find(keyValues);
        }
        public void Add<T>(T entityToCreatre) where T : class
        {
            _db.Set<T>().Add(entityToCreatre);

        }
        public void Delete<T>(params object[] keyValues) where T : class
        {
            _db.Set<T>().Remove(Find<T>(keyValues));

        }
        public void SaveChanges()
        {
            try
            {
                _db.SaveChanges();
            }
            catch (DbEntityValidationException error)
            {
                var firstError = error.EntityValidationErrors.First().ValidationErrors.First().ErrorMessage;
                throw new ValidationException(firstError);
            }

        }

    }
}
public static class GenicReposotoryExtenion
{
    public static IQueryable<T> Include<T, TProperty>(this IQueryable<T> queryable, Expression<Func<T, TProperty>> relatedEntity) where T :
class
    {
        return System.Data.Entity.QueryableExtensions.Include<T, TProperty>(queryable, relatedEntity);
    }
}
