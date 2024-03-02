using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities
{
    public class ProductType : BaseEntity
    {
        [Column(TypeName = "VARCHAR")]
        [StringLength(250)]
        public string Name { get; set; }
    }
}