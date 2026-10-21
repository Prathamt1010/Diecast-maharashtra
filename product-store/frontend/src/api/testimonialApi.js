import axios from "./axios";

// Get all active testimonials
export const getTestimonials = () => {
  return axios.get("/testimonials");
};

// Create testimonial
export const createTestimonial = (data) => {
  return axios.post("/testimonials", data);
};

// Update testimonial
export const updateTestimonial = (id, data) => {
  return axios.put(`/testimonials/${id}`, data);
};

// Delete testimonial
export const deleteTestimonial = (id) => {
  return axios.delete(`/testimonials/${id}`);
};