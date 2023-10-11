
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specification
{
    public class ProductwithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductwithTypesAndBrandsSpecification(ProductSpecParams productPrams)
            :base(x =>
                (string.IsNullOrEmpty(productPrams.Search) || x.Name.ToLower().Contains
                    (productPrams.Search)) && 
                (!productPrams.BrandId.HasValue || x.ProductBrandId == productPrams.BrandId) &&
                (!productPrams.TypeId.HasValue || x.ProductTypeId == productPrams.TypeId) 
            )
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
            AddOrderBy(x => x.Name);
            ApplyPaging(productPrams.PageSize * (productPrams.PageIndex -1), productPrams.PageSize);
            if(!string.IsNullOrEmpty(productPrams.Sort))
            {
                switch(productPrams.Sort)
                {
                    case "priceAsc":
                        AddOrderBy(p=>p.Price);
                        break;
                    case "priceDesc" :
                        AddOrderByDesending(p=>p.Price);
                        break;
                    default :
                        AddOrderBy(n => n.Name);
                        break;
                }
            }
        }

        public ProductwithTypesAndBrandsSpecification(int id) 
            : base(x =>x.Id == id)
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }
    }
}