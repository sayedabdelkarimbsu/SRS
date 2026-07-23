export class FileParser {
  static async parseFile(file) {
    try {
      const text = await file.text();
      const data = {};

      // Extract email
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) data.email = emailMatch[0];

      // Extract phone numbers
      const phoneMatch = text.match(/\+?[0-9]{10,15}/);
      if (phoneMatch) data.phone = phoneMatch[0];

      // Extract names (simple pattern)
      const nameMatch = text.match(/[A-Z][a-z]+ [A-Z][a-z]+/);
      if (nameMatch) {
        const parts = nameMatch[0].split(' ');
        data.firstName = parts[0] || '';
        data.lastName = parts[1] || '';
      }

      // Extract LinkedIn URL
      const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/);
      if (linkedinMatch) data.linkedin = 'https://' + linkedinMatch[0];

      // Extract GitHub URL
      const githubMatch = text.match(/github\.com\/[a-zA-Z0-9-]+/);
      if (githubMatch) data.github = 'https://' + githubMatch[0];

      // Extract URLs
      const urlMatches = text.match(/https?:\/\/[^\s]+/g);
      if (urlMatches) data.urls = urlMatches;

      // Extract skills (common keywords)
      const skillsKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'HTML', 'CSS'];
      const foundSkills = skillsKeywords.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
      if (foundSkills.length > 0) data.skills = foundSkills;

      return data;
    } catch (error) {
      console.error('FileParser Error:', error);
      return null;
    }
  }

  static parsePDF(file) {
    // Note: For real PDF parsing, use pdf-parse library
    return new Promise((resolve) => {
      resolve({ warning: 'PDF parsing requires pdf-parse library' });
    });
  }

  static parseDocx(file) {
    // Note: For real DOCX parsing, use mammoth library
    return new Promise((resolve) => {
      resolve({ warning: 'DOCX parsing requires mammoth library' });
    });
  }
}

export default FileParser;
