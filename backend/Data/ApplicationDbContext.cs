using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Description).HasMaxLength(800);
                entity.Property(e => e.Credits).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
            });

            // Enrollment entity configuration - Spring Boot'taki @JoinTable karşılığı
            modelBuilder.Entity<Enrollment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Enrollments)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Course)
                    .WithMany(c => c.Enrollments)
                    .HasForeignKey(e => e.CourseId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Spring Boot'taki @UniqueConstraint karşılığı -- UserId-CourseId ikilisinin tekrar edilmemesi
                entity.HasIndex(e => new { e.UserId, e.CourseId })
                    .IsUnique()
                    .HasDatabaseName("IX_Enrollment_User_Course");


            });

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(30);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(30);
            entity.Property(e => e.DateOfBirth).IsRequired();
            entity.Property(e => e.Role)
                .HasConversion<string>();
        });

        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }
    }
} 