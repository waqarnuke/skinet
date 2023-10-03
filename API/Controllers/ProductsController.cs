
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
     [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly StoreContext _contex;

        public ProductsController(StoreContext contex)
        {
            _contex = contex;
        }  

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var products = await  _contex.products.ToListAsync();
            return products;
        } 

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            var products = await  _contex.products.FindAsync(id);
            return products;
        } 
    }
}