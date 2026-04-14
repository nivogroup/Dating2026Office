using System.Text.Json.Serialization;

namespace API.Entities;

public class Photo
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public string? PublicId { get; set; }

    // Navigation Property as One Member can have one or multiple photo
    [JsonIgnore]
    public Member Member { get; set; }= null!;
    public string MemberId { get; set; } = null!;


}
