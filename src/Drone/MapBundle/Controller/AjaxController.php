<?php

namespace Drone\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use Drone\MapBundle\Entity\Drone;
use Drone\MapBundle\Entity\Field;
use Drone\MapBundle\Entity\Point;

class AjaxController extends Controller
{
	public function saveDroneLocationAction() {

		$response = new JsonResponse();
		$response->setData(array(
			'serialNumber' => $drones[0]->getSerialNumber(),
			'latitude'     => $lat,
			'longitude'    => $lon,
		));
		return $response;
		
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$request = $this->container->get('request');

		$lat = $request->get('lat');
		$lon = $request->get('lon');

		$drone = new Drone();
		$drone->setLatitude($lat)
			  ->setLongitude($lon)
			  ->setProduct('Parrot')
			  ->setSerialNumber($this->generateSerialNumber(20));

		$userManager = $this->container->get('fos_user.user_manager');
		$em = $this->getDoctrine()->getManager();
		$em->persist($drone);
		$em->flush();

		$user->addDrone($drone);
		$userManager->updateUser($user);

		$drones = $user->getDrones();

		$response = new JsonResponse();
		$response->setData(array(
			'serialNumber' => $drones[0]->getSerialNumber(),
			'latitude'     => $lat,
			'longitude'    => $lon,
		));
		return $response;
	}

	public function saveFieldLocationAction() {
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$request = $this->container->get('request');
		$fields  = $request->get('fieldCorners');

		$userManager = $this->container->get('fos_user.user_manager');
		$em = $this->getDoctrine()->getManager();
		$userFields = $user->getFields();

		$this->deleteFields();

		foreach ($fields as $corners) {
			$fieldEntity = new Field();
			foreach ($corners as $corner) {
				$pointEntity = new Point();
				$pointEntity->setLatitude($corner['latitude']);
				$pointEntity->setLongitude($corner['longitude']);

				$em->persist($pointEntity);
				$fieldEntity->addPoint($pointEntity);
			}
			if(!$userFields->contains($fieldEntity)){
				$em->persist($fieldEntity);
				$em->flush();
				$user->addField($fieldEntity);
				$userManager->updateUser($user);
			}else{
				foreach ($fieldEntity->getPoints() as $point) {
					$fieldEntity->removePoint($point);
					$em->remove($point);
				}
				$em->flush();
			}
		}

		$response = new JsonResponse();
		$response->setData(array(
			'success' => 'true',
		));
		return $response;
	}

	public function savePointLocationAction() {
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$request        = $this->container->get('request');
		$interestPoints = $request->get('points');

		$userManager = $this->container->get('fos_user.user_manager');
		$em = $this->getDoctrine()->getManager();
		$userInterestPoints = $user->getPoints();

		foreach ($interestPoints as $point) {
			$pointEntity = new Point();
			$pointEntity->setLatitude($point['location']['latitude']);
			$pointEntity->setLongitude($point['location']['longitude']);
			$pointEntity->setAction($point['action']);
			if(!$userInterestPoints->contains($pointEntity)){
				$em->persist($pointEntity);
				$em->flush();

				$user->addPoint($pointEntity);
				$userManager->updateUser($user);
			}
		}

		$response = new JsonResponse();
		$response->setData(array(
			'success'        => 'true',
			'interestPoints' => $interestPoints,
		));
		return $response;
	}

	public function deleteDronesAction() {
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$userManager = $this->container->get('fos_user.user_manager');
		$em = $this->getDoctrine()->getManager();

		foreach($user->getDrones() as $drone) {
			$user->removeDrone($drone);
			$em->remove($drone);
		}
		$em->flush();

		$response = new JsonResponse();
		$response->setData(array(
			'success' => 'true',
		));
		return $response;
	}

	public function deleteFieldsAction() {
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}
		$request        = $this->container->get('request');
		$interestPoints = $request->get('points');

		$userManager = $this->container->get('fos_user.user_manager');
		$em = $this->getDoctrine()->getManager();

		foreach($user->getFields() as $field) {
			$user->removeField($field);
			$em->remove($field);
		}
		foreach ($user->getPoints() as $point) {
			foreach($interestPoints as $iPoint){
				if($point->getLatitude() == $iPoint['latitude'] &&
				   $points->getLongitude() == $iPoint['longitude']){
					$user->removePoint($point);
					$em->remove($point);
				}
			}
		}
		$userManager->updateUser($user);
		$em->flush();

		$response = new JsonResponse();
		$response->setData(array(
			'success' => 'true',
		));
		return $response;
	}

	public function deleteInterestPointsAction() {
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$userManager = $this->container->get('fos_user.user_manager');
		$em = $this->getDoctrine()->getManager();

		foreach($user->getPoints() as $point) {
			$user->removePoint($point);
			$em->remove($point);
		}
		$userManager->updateUser($user);
		$em->flush();

		$response = new JsonResponse();
		$response->setData(array(
			'success' => 'true',
		));
		return $response;
	}

	protected function deletePoints(){
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$userManager = $this->container->get('fos_user.user_manager');
		$em = $this->getDoctrine()->getManager();

		foreach($user->getPoints() as $point) {
			$user->removePoint($point);
			$em->remove($point);
		}
		$userManager->updateUser($user);
		$em->flush();

		return true;
	}

	protected function deleteFields(){
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}
		$request        = $this->container->get('request');
		$interestPoints = $request->get('points');

		$userManager = $this->container->get('fos_user.user_manager');
		$em = $this->getDoctrine()->getManager();

		foreach($user->getFields() as $field) {
			$user->removeField($field);
			$em->remove($field);
		}
		foreach ($user->getPoints() as $point) {
			foreach($interestPoints as $iPoint){
				if($point->getLatitude() == $iPoint['latitude'] &&
				   $points->getLongitude() == $iPoint['longitude']){
					$user->removePoint($point);
					$em->remove($point);
				}
			}
		}
		$userManager->updateUser($user);
		$em->flush();

		return true;
	}

	protected function generateSerialNumber($length = 10) {
		$characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}
}
