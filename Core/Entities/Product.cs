using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities
{
    public class Product : BaseEntity
    {

        [Column(TypeName = "VARCHAR")]
        [StringLength(250)]
        public string Name { get; set; }

        [Column(TypeName = "VARCHAR")]
        [StringLength(250)]
        public string Description { get; set; }
        public decimal Price { get; set; }

        [Column(TypeName = "VARCHAR")]
        [StringLength(250)]
        public string PictureUrl { get; set; }
        public ProductType ProductType { get; set; }
        public int ProductTypeId { get; set; }
        public ProductBrand ProductBrand { get; set; }
        public int ProductBrandId { get; set; }
    }
}