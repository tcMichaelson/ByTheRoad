using System.Linq;

namespace ByTheRoad.Models
{
    public interface IGenericRepository
    {
        void Add<T>(T entityToCreatre) where T : class;
        void Delete<T>(params object[] keyValues) where T : class;
        T Find<T>(params object[] keyValues) where T : class;
        IQueryable<T> Query<T>() where T : class;
        void SaveChanges();
    }
}