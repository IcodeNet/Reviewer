using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Reviewer.Web.Mvc.Controllers.MVC;

namespace Reviewer.Web.Mvc.Data
{
    /// <summary>
    ///     The entity framework concrete database context.
    /// </summary>
    public class MyDbContext : DbContext
    {
        public MyDbContext()
            : base("name=DefaultConnection")
        {
            Database.SetInitializer<MyDbContext>(null);
        }

        public DbSet<ScenarioViewRecord> ScenariaSet { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}