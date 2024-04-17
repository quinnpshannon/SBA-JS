// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  }; // Default Data
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  }; // Default Data
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-03-07",
        score: 440
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    },
    {
      learner_id: 555,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-03-07",
        score: 40
      }
    },
    {
      learner_id: 101,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ]; // Default Data, plus some additions
  /*  Start of the Program!
      First we have a try catch. There are a bunch of things that will throw errors
      in the program, and I tried to account for a bunch of weird situations
      just in case that things didn't process properly.
  */
  try {
    const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
    console.log(result);
  }
  catch (e) {
    console.error(e);
  }
  function getLearnerData(course, ag, subs) {
    if (bouncer(course.id,ag.course_id)) throw new Error('Assignment Group is not part of the Course group!');
    const result=[];
    const students=uniqueLearner(subs);
    const grades=[];
    students.forEach(ele => {
      grades.push(splitLearner(subs,ele));
    });
    grades.forEach(ele => {
      gradeLearner(ele,ag); 
      // OK, this doesn't actually return anything yet
      // that's why I'm not seeing any results!
    });
    return grades;
    // Here is an example of what we are looking for, but no math was done
    // const result = [
    //   {
    //     id: 125,
    //     avg: 0.985, // (47 + 150) / (50 + 150)
    //     1: 0.94, // 47 / 50
    //     2: 1.0 // 150 / 150
    //   },
    //   {
    //     id: 132,
    //     avg: 0.82, // (39 + 125) / (50 + 150)
    //     1: 0.78, // 39 / 50
    //     2: 0.833 // late: (140 - 15) / 150
    //   }
    // ];
    return result;
  }
  function bouncer(base, compare){
    // It's called the bouncer, because it checks ID. If they don't match
    // the data gets Thrown out.
    return base !== compare;
  }
  function isValidScore(pts,total){
    // This function throws errors if the score is invalid in any way
    // Well, at least the ways that I can think of.
    if(total===0) { // Can't divide by Zero
      throw new Error('Cannot be worth Zero points');
    }
    if (typeof pts != "number"){ // if the number of points attained isn't a number
      throw new Error('Points is not a Number Value!');  
    }
    if (typeof total != "number"){ // if the number of total points isn't a number
      throw new Error('Total is not a Number Value!');  
    }
    if (pts > total){ // If they earned more points than possible
      throw new Error('Not Valid score, No extra credit!');
    }
    return true; // Otherwise, Data looks good!
  }
  function isDue(dueDate,submitDate){
    // If the assignment is Due, return true
    if (Date.valueOf(dueDate) <= Date.now()) return true;
    return false;
  }
  function isLate(dueDate,submitDate){
    // If the assignment is late, Return True
    if (Date.valueOf(submitDate) > Date.valueOf(dueDate)) return true;
    return false;
  }
  function uniqueLearner(array){
    // take the -array- of submissions and return
    // an array with the sorted ids of Unique students
    const learner = [];
    array.forEach(ele => {
      if (!learner.includes(ele.learner_id)) learner.push(ele.learner_id);
    });
    learner.sort((a, b) => a - b);
    return learner;
  }
  function splitLearner(array,learnID){
    // Take the -array- of Number scores, make a new array,
    // and split out one specific learner by -learnID-
    // then return that array
    const learner = [];
    array.forEach(element => {
      if(element.learner_id === learnID) learner.push(element);
    });
    learner.sort((a, b) => a.assignment_id - b.assignment_id);
    return learner;
  }
  function gradeLearner(subs,assigned){
    // Here we are going to take two arrays, and do some math
    // we loop through the array -subs- and compare the assignment_id to
    // the assignment_id in the array -assigned-
    const checkem = [];
    subs.forEach(subEle => {
      //console.log(subEle.submission.score);
      assigned.assignments.forEach(assignEle => {
        if(subEle.assignment_id === assignEle.id){
          // we check to see if it is a Valid Score
          if (isValidScore(subEle.submission.score,assignEle.points_possible)){
            // we check to see if it is due
            // Actually, we are going to do that later. Right now just want to see if this syntax is right
            if (isDue(assignEle.due_at,subEle.submission.submitted_at)){
              isLate(assignEle.due_at,subEle.submission.submitted_at) ?checkem.push(subEle.submission.score-10) : checkem.push(subEle.submission.score) ;
            }
            if(isLate(assignEle.due_at,subEle.submission.submitted_at)) console.log("It's Late!");
            //console.log(subs[x].submission.score/assigned.assignments[y].points_possible);
          }
        }
      });
    });
  }