using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly StoreContext _context;
        public ProductRepository(StoreContext context )
        {
            _context = context;
        }

        public async Task<IReadOnlyList<ProductBrand>> GetProdcutBrandsAsync()
        {
            return await _context.ProductBrands.ToListAsync();
        }

        public async Task<IReadOnlyList<Product>> GetProdcutsAsync()
        {
            return await _context.Products
            .Include(p => p.ProductType)
            .Include(p=>p.ProductBrand)
            .ToListAsync();
        }

        public async Task<IReadOnlyList<ProductType>> GetProdcutTypesAsync()
        {
            return await _context.productTypes.ToListAsync();
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _context.Products
            .Include(p => p.ProductType)
            .Include(p => p.ProductBrand)
            .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}