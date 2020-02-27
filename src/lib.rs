mod utils;

use wasm_bindgen::prelude::*;
extern crate js_sys;
use js_sys::Math;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}


#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Vector3D {
    x: f32,
    y: f32,
    z: f32,
}

#[wasm_bindgen]
pub struct Particle {
    position: Vector3D,
    velocity: Vector3D,
}

impl Particle {
    fn tick(&mut self, dt: f32, g: f32) {
        // apply gravitational force
        self.velocity.y -= g * dt;

        // update positions based on velocity
        self.position.x += self.velocity.x * dt;
        self.position.y += self.velocity.y * dt;
        self.position.z += self.velocity.z * dt;
    }

    fn new() -> Particle {
        let position = Vector3D { 
            x: (Math::random() as f32)*1000.0,
            y: (Math::random() as f32)*1000.0,
            z: (Math::random() as f32)*1000.0,
        };
        let velocity = Vector3D { 
            x: (Math::random() as f32)*10.0,
            y: (Math::random() as f32)*10.0,
            z: (Math::random() as f32)*10.0,
        };
        
        Particle {
            position,
            velocity,
        }
    }
}

pub struct Config {
    particle_num: usize,
    gravity: f32,
}

impl Config {
    pub fn new() -> Config {
        let particle_num = 500;
        let gravity = 9.81;

        Config {  
            particle_num,
            gravity,
        }
    }
}

#[wasm_bindgen]
pub struct Simulation {
    origin: Vector3D,
    edge: Vector3D,
    particles: Vec<Particle>,
    config: Config,
}

#[wasm_bindgen]
impl Simulation {
    
    pub fn new() -> Simulation {
        let config = Config::new();
        let origin = Vector3D {
            x: 0.0,
            y: 0.0,
            z: 0.0,
        };
        let edge = Vector3D {
            x: 100.0,
            y: 100.0,
            z: 100.0,
        };

        let mut particles: Vec<Particle> = Vec::with_capacity(config.particle_num);
        for _ in 0..particles.capacity() {
            particles.push(Particle::new());
        }
        
        Simulation {
            origin,
            edge,
            particles,
            config,
        }
    }

    pub fn tick(&mut self, dt: f32) {
        for i in 0..self.particles.len() {
            let p = &mut self.particles[i];
            p.tick(dt, self.config.gravity);
        }
    }
    
    pub fn check_collision(&mut self) {
        for i in 0..self.particles.len() {
            let p = &mut self.particles[i];
            if p.position.x < self.origin.x {
                p.position.x = self.origin.x - (p.position.x - self.origin.x);
                p.velocity.x *= -0.8;
            }
            if p.position.y < self.origin.y {
                p.position.y = self.origin.y - (p.position.y - self.origin.y);
                p.velocity.y *= -0.8;
            }
            if p.position.z < self.origin.z {
                p.position.z = self.origin.z - (p.position.z - self.origin.z);
                p.velocity.z *= -0.8;
            }
    
            if p.position.x > self.edge.x {
                p.position.x = self.edge.x - (p.position.x - self.edge.x);
                p.velocity.x *= -0.8;
            }
            if p.position.y > self.edge.y {
                p.position.y = self.edge.y - (p.position.y - self.edge.y);
                p.velocity.y *= -0.8;
            }
            if p.position.z > self.edge.z {
                p.position.z = self.edge.z - (p.position.z - self.edge.z);
                p.velocity.z *= -0.8;
            }
        }
    }

    pub fn height(&self) -> f32 {
        self.edge.y
    }
    pub fn width(&self) -> f32 {
        self.edge.x
    }
    pub fn depth(&self) -> f32 {
        self.edge.z
    }

    pub fn update_height(&mut self, height: f32) {
        self.edge.y = height;
    }

    pub fn update_width(&mut self, width: f32) {
        self.edge.x = width;
    }

    pub fn update_depth(&mut self, depth: f32) {
        self.edge.z = depth;
    }

    pub fn particles(&self) -> *const Particle {
        self.particles.as_ptr()
    }

    pub fn particle_count(&self) -> u32 {
        self.particles.len() as u32
    }

    pub fn update_particles(&mut self, count: u32) {
        self.particles.clear();
        // finish updating particles
    }

    pub fn gravity(&self) -> f32 {
        self.config.gravity
    }

    pub fn update_gravity(&mut self, g: f32) {
        self.config.gravity = g;
    }
}