using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities.OrderAggregate
{
    public class DeliveryMethod : BaseEntity
    {
        [Column(TypeName = "VARCHAR")]
        [StringLength(250)]
        public string ShortName { get; set; }

        [Column(TypeName = "VARCHAR")]
        [StringLength(250)]
        public string DeliveryTime { get; set; }

        [Column(TypeName = "VARCHAR")]
        [StringLength(250)]
        public string Description { get; set; }
        public decimal Price { get; set; }
    }
}