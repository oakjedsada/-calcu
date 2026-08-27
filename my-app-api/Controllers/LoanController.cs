using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using my_app_api.Data;
using my_app_api.Models;

namespace my_app_api.Controllers;

[ApiController] //API controller
[Route("api/[controller]")]  // → /api/loan
public class LoanController(AppDbContext db) : ControllerBase //AppDbContext db คือ inject database เข้ามา — เหมือน inject(Service) ใน Angular
{
    // GET /api/loan — ดึงข้อมูลทั้งหมด
    [HttpGet]
    public async Task<IEnumerable<LoanProfile>> GetAll()
        => await db.LoanProfiles.ToListAsync();

    // GET /api/loan/1 — ดึงข้อมูลตาม id
    [HttpGet("{id}")]
    public async Task<ActionResult<LoanProfile>> GetById(int id)
    {
        var profile = await db.LoanProfiles.FindAsync(id);
        return profile is null ? NotFound() : Ok(profile);
    }

    // POST /api/loan — บันทึกข้อมูลใหม่
    [HttpPost]
    public async Task<ActionResult<LoanProfile>> Create(LoanProfile profile)
    {
        profile.UpdatedAt = DateTime.UtcNow;
        db.LoanProfiles.Add(profile);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = profile.Id }, profile);
    }

    // PUT /api/loan/1 — อัปเดตข้อมูล
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, LoanProfile profile)
    {
        if (id != profile.Id) return BadRequest();
        profile.UpdatedAt = DateTime.UtcNow;
        db.Entry(profile).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/loan/1 — ลบข้อมูล
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var profile = await db.LoanProfiles.FindAsync(id);
        if (profile is null) return NotFound();
        db.LoanProfiles.Remove(profile);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
