namespace my_app_api.Models;

// แบบแผนข้อมูลที่จะเก็บลง database — 1 row = ข้อมูลกู้ กยศ. 1 ชุด
public class LoanProfile
{
    public int Id { get; set; }                  // primary key (auto increment)
    public string Name { get; set; } = "ของฉัน"; // ชื่อโปรไฟล์
    public decimal TotalBorrowed { get; set; }    // ยอดกู้สะสมปัจจุบัน
    public int ExtraYears { get; set; }           // จะกู้เพิ่มอีกกี่ปี
    public decimal ExtraPerYear { get; set; }     // ยอดกู้เพิ่มต่อปี
    public decimal InterestRate { get; set; }     // อัตราดอกเบี้ย
    public int RepaymentYears { get; set; }       // ระยะเวลาผ่อน
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
