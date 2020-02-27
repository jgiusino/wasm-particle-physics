import * as wasm from "wasm-particle-physics";
import { memory } from "wasm-particle-physics/wasm_particle_physics_bg"

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// instantiate simulation
var simulation = wasm.Simulation.new();


// create scene and camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
);
camera.position.set( 0, 20, 100);

// create renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// create camera controls
var controls = new OrbitControls(camera, renderer.domElement);


var geometry = new THREE.SphereGeometry(0.25,8,8);
var material = new THREE.MeshNormalMaterial();

// create particles array to access particle positions and velocity data
// for each particle. Each particle has a x,y,z position and x,y,z velocity
// requiring 6 floating point numbers to represent each particle
var particleCount = simulation.particle_count();
var particlesPtr = simulation.particles();
var particles = new Float32Array(memory.buffer, particlesPtr, particleCount*6);

// particle mech to represent each particle in 3D space
var particleMesh = new THREE.Mesh( geometry, material );

// an array to store the individual meshes for each particle 
var meshArray = [];

// create a unique mesh for each particle in the simulation
for (let index = 0; index < particleCount; index++) {
    meshArray.push(particleMesh.clone());
};

// add each mesh to the scene
meshArray.forEach( mesh => scene.add( mesh ));

// stores the configurable options that dat.gui can display and modify
class Options {
    constructor() {
        this.height = simulation.height();
        this.width = simulation.width();
        this.depth = simulation.depth();
        this.gravity = simulation.gravity();
    }
}

// render loop for the simulation
function animate() {
    requestAnimationFrame( animate );
    simulationUpdate();
    controls.update();
    renderer.render( scene, camera );
}

// updates all particles in the simulation and updates particle postions
function simulationUpdate() {
    simulation.tick(0.1);
    simulation.check_collision();
    // iterates through the mesh array and particle position/velocity array
    for (let index = 0; index < meshArray.length; index++) {
        // each particle mesh has 6 values in particle array
        var j = index * 6;
        // get particle mesh
        var mesh = meshArray[index];
        // set position of mesh using particle values for position
        mesh.position.set(
            particles[j],       // position x
            particles[j + 1],   // position y
            particles[j + 2],   // position z
            // particles[j+3] to particles[j+5] are velocity x,y,z
        );
    }
}

// adds dat.gui controls to web page
function addGUI() {
    var gui = new dat.GUI();
    var text = new Options;
    var height = gui.add(text, 'height', 0.0, 1000.0);
    var width = gui.add(text, 'width', 0.0, 1000.0);
    var depth = gui.add(text, 'depth', 0.0, 1000.0);
    var gravity = gui.add(text, 'gravity', 0.0, 100.0);
    height.onChange((value) => {
        simulation.update_height(value);
    });
    width.onChange((value) => {
        simulation.update_width(value);
    });
    depth.onChange((value) => {
        simulation.update_depth(value);
    });
    gravity.onChange((value) => {
        simulation.update_gravity(value);
    });
}


addGUI();
animate();