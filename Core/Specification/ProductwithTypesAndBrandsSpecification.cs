
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specification
{
    public class ProductwithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductwithTypesAndBrandsSpecification()
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }

        public ProductwithTypesAndBrandsSpecification(int id) 
            : base(x =>x.Id == id)
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }
    }
}