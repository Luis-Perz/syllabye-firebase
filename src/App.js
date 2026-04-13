import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>SyllaBye!</h1>
      <form>
        <label> Semester: </label>
        <select>
          <option value="fall2026">Fall 2026</option>
          <option value="spring2027">Spring 2027</option>
          <option value="summer2027">Summer 2027</option>
        </select>
        <br /><br />

        <label> Department: </label>
        <select>
          <option value="CPSC">Computer Science</option>
          <option value="MATH">Mathematics</option>
          <option value="PHYS">Physics</option>
        </select>
        <br /><br />

        <label> Course Name: </label>
        <input type="text" placeholder="Enter course name (e.g., Introduction to Programming)" />
        <br /><br />

        <label> Course Number: </label>
        <input type="text" placeholder="Enter course code (e.g., 110)" />
        <br /><br />

        <label> Section: </label>
        <input type="text" placeholder="Enter section number (e.g., 001)" />
        <br /><br />

        <label> Instructor: </label>
        <input type="text" placeholder="Enter instructor name (e.g., Dr. Smith)" />
        <br /><br />

        <label> Upload Syllabus: </label>
        <input type="file" />
        <br /><br />
        <button type="submit">Submit</button>

        
      </form>
    </div>
  );
}

export default App;
