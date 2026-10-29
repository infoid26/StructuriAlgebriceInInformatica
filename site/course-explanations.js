import {groupExplanations} from './explanations-groups.js';
import {fieldExplanations} from './explanations-fields.js';
import {matrixExplanations} from './explanations-matrices.js';
import {applicationExplanations} from './explanations-applications.js';

export function applyCourseExplanations(lessons){
 const explanations={...groupExplanations,...fieldExplanations,...matrixExplanations,...applicationExplanations};
 for(const lesson of lessons){
  const explanation=explanations[lesson.id];
  if(!explanation)throw Error('Missing explanation: '+lesson.id);
  lesson.theory=explanation.theory;
  lesson.goal=explanation.goal;
  if(explanation.worked)lesson.worked=explanation.worked;
  if(explanation.trap)lesson.trap=explanation.trap;
 }
}
